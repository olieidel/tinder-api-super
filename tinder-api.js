'use strict';

var request = require('request');

var TINDER_HOST = 'https://api.gotinder.com';

module.exports = TinderApi;

function TinderApi() {
  var self = this;

  // Responses:
  // auth, update
  self.rsp = { auth: {} };
}


TinderApi.prototype.RequestCallback = function (callback, storageVar) {
  var self = this;

  return function(error, response, body) {
    if (error) {
      throw new self.RequestException(error);
    }
    else if (response.statusCode !== 200) {
      throw new self.RequestException('HTTP Response ' + response.statusCode);
    }
    else if (typeof body !== 'object' && typeof body !=='string') {
      console.log(body);
      throw new self.RequestException('Request didn\'t return JSON Object (' + typeof body + ')');
    }
    else {
      var data = (
        typeof body === 'string'
          ? JSON.parse(body)
          : body
      );

      if (storageVar) {
        self.rsp[storageVar] = data;
      }

      if (callback) {
        callback(null, data);
      }
    }
  }

};

TinderApi.prototype.ApiException = function (value) {
  var self = this;
  self.message = 'API Exception: ' + value;
  self.toString = function() {
    return self.message;
  }
};

TinderApi.prototype.RequestException = function (value) {
  var self = this;
  self.message = 'Request Exception: ' + value;
  self.toString = function() {
    return self.message;
  }
};

TinderApi.prototype.AuthException = function () {
  var self = this;
  self.toString = function() {
    return 'Not authenticated yet! Use authenticate() first.';
  }
};

TinderApi.prototype.checkAuth = function () {
var self = this;
  if (!self.rsp.auth.token)
    throw new self.AuthException();
};

TinderApi.prototype.getLastActivityDate = function () {
  var self = this;
  if (self.rsp.lastUpdateResponse.last_activity_date)
    return self.rsp.lastUpdateResponse.last_activity_date;
  else
    return '';
};

TinderApi.prototype.constructReqOpts = function (serverPath, jsonData) {
  var self = this;
  var headers = {
    'platform': 'android',
    'User-Agent': 'Tinder Android Version 4.3.5',
    'os_version': '22',
    'app-version': '833'
  };

  if(self.rsp.auth.token) {
    headers['X-Auth-Token'] = self.rsp.auth.token;
  }

  var opts = {
    url: serverPath,
    headers: headers
  };

  if (jsonData) {
    opts['json'] = jsonData;
  }

  return opts;
};

TinderApi.prototype.authorize = function (fbToken, locale, callback) {
  var self = this;
  var data = {
    facebook_token: fbToken,
    locale: locale
  };

  request.post(
    self.constructReqOpts(TINDER_HOST + '/auth', data),
    self.RequestCallback(callback, 'auth')
  );
};


TinderApi.prototype.getUpdates = function (callback) {
  var self = this;
  self.checkAuth();

  var data = {
    last_activity_date: getLastActivityDate()
  };

  request.post(
    self.constructReqOpts(TINDER_HOST + '/updates', data),
    self.RequestCallback(callback, 'update'));
};

TinderApi.prototype.getMeta = function(callback) {
  var self = this;
  self.checkAuth();

  request.get(
    self.constructReqOpts(TINDER_HOST + '/meta'),
    self.RequestCallback(callback, 'meta')
  );
};

TinderApi.prototype.getPopularLocations = function(callback) {
  var self = this;
  self.checkAuth();

  request.get(
    self.constructReqOpts(TINDER_HOST + '/location/popular'),
    self.RequestCallback(callback, 'popularLoc')
  );
};

TinderApi.prototype.getMoments = function(callback) {
  var self = this;
  self.checkAuth();

  var data = {
    last_activity_date: getLastActivityDate(),
    last_moment_id: '' // TODO: What's this?
  };

  request.post(
    self.constructReqOpts(TINDER_HOST + '/feed/moments', data),
    self.RequestCallback(callback, 'moments')
  );
};

TinderApi.prototype.getRecs = function(callback) {
  var self = this;
  self.checkAuth();

  request.get(
    self.constructReqOpts(TINDER_HOST + '/user/recs'),
    self.RequestCallback(callback, 'recs')
  );
};

TinderApi.prototype.getUser = function (userId, callback) {
  var self = this;
  self.checkAuth();

  if(!userId)
    throw new self.ApiException('Missing userId!');

  request.get(
    self.constructReqOpts(TINDER_HOST + '/user/' + userId),
    self.RequestCallback(callback)
  );
};

TinderApi.prototype.setProfile = function(opts, callback) {
  var self = this;
  self.checkAuth();

  if (!opts.discoverable || !opts.gender_filter || !opts.age_filter_min ||
    !opts.age_filter_max || !opts.distance_filter) {
    throw new self.ApiException('Incomplete Call. Your opts Object is missing' +
      ' parameters');
  }

  request.post(
    self.constructReqOpts(TINDER_HOST + '/profile', opts),
    self.RequestCallback(callback, 'profile')
  );
};

TinderApi.prototype.setLocation = function(loc, callback) {
  var self = this;
  self.checkAuth();

  if (!loc.lat || !loc.lon) {
    throw new self.ApiException('Your loc Object is missing lat or lon' +
      ' attributes');
  }

  request.post(
    self.constructReqOpts(TINDER_HOST + '/user/ping', loc),
    self.RequestCallback(callback, 'ping')
  );
};

TinderApi.prototype.sendLike = function(likedUserId, callback) {
  var self = this;
  self.checkAuth();

  if (!likedUserId || typeof likedUserId !== 'string') {
    throw new self.ApiException('Missing likedUserId or not String');
  }

  request.get(
    self.constructReqOpts(TINDER_HOST + '/like/' + likedUserId),
    self.RequestCallback(callback, 'like')
  );
};

TinderApi.prototype.sendSuperLike = function(likedUserId, callback) {
  var self = this;
  self.checkAuth();

  if (!likedUserId || typeof likedUserId !== 'string')
    throw new self.ApiException('Missing likedUserId or not String');

  request.post(
    self.constructReqOpts(TINDER_HOST + '/like/' + likedUserId + '/super'),
    self.RequestCallback(callback, 'superLike')
  );
};

TinderApi.prototype.sendPass = function(passedUserId, callback) {
  var self = this;
  self.checkAuth();

  if (!passedUserId || typeof passedUserId !== 'string')
    throw new self.ApiException('Missing likedUserId or not String');

  request.get(
    self.constructReqOpts(TINDER_HOST + '/pass/' + passedUserId),
    self.RequestCallback(callback, 'pass')
  );
};

TinderApi.prototype.sendMessage = function(userId, message, callback) {
  var self = this;
  self.checkAuth();

  if (!userId || !message)
    throw new self.ApiException('Missing userId or message!');

  var data = {
    message: message
  };

  request.post(
    self.constructReqOpts(TINDER_HOST + '/user/matches/' + userId, data),
    self.RequestCallback(callback)
  );
};