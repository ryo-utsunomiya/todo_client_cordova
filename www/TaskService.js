(function() {
  'use strict';
  
  function TaskService($http, API_URL) {
    var self = this;
    var apiUrl = 'https://shrouded-oasis-87423.herokuapp.com';
    
    self.getItems = function(successCallback) {
      var items = [];
      $http.get(API_URL + '/tasks.json')
      .then(function (success) {
        // console.log(success);
        items = success.data;        
        items.forEach(function(item){
          item.isNew = false;
        });
        
        if (typeof successCallback === 'function') {
          successCallback(items);
        }
      }, function (error) {
        console.log(error);
      });      
    };
    
    self.newTask = function() {      
      return {
        title: '',
        done: false,
        isNew: true
      };
    };
    
    self.saveItems = function(items) {
      if (!Array.isArray(items)) return;
  
      items.forEach(function(item) {
        saveItem(item);
      });
    }
    
    self.deleteItem = function (item) {
      $http.delete(apiUrl + '/tasks/' + encodeURIComponent(item.id) + '.json')
      .then(function (success) {
        console.log(success);
      }, function(error) {
        console.log(error);
      });
    }
        
    function saveItem(item) {
      save(item)
      .then(function (success) {
        item = success.data;
        item.isNew = false;
      }, function (error) {
        console.log(error);
        // todo: show error
      });      
    }
        
    function save(item) {
      if (item.isNew) {
        return create(item);
      } else {
        return update(item);
      }
    }
  
    function create(item) {
      item.isNew = false;
      return $http.post(apiUrl + '/tasks.json', formatItemForSave(item));
    }
    
    function update(item) {
      return $http.patch(
        apiUrl + '/tasks/' + encodeURIComponent(item.id) + '.json',
        formatItemForSave(item)
      );
    }
    
    function formatItemForSave(item) {
      return {
        title: item.title,
        done: item.done
      };
    }  
  }

  angular.module(APP).service('TaskService', ['$http', 'API_URL', TaskService]);
})();