(function() {
  'use strict';
  
  window.APP = 'app';
  
  angular.module(APP, ['onsen'])
    .constant('API_URL', 'https://shrouded-oasis-87423.herokuapp.com');
})();
