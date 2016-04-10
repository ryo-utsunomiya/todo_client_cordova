(function() {
  'use strict';
  
  function TaskService($http, API_URL) {
    var self = this;
    
    self.getItems = function(successCallback) {
      var items = [];
      modal.show();
      $http.get(API_URL + '/tasks.json')
      .then(function (success) {
        items = success.data;        
        items.forEach(function(item){
          item.isNew = false;
        });
        
        if (typeof successCallback === 'function') {
          successCallback(items);
        }
        
        modal.hide();
      }, function (error) {
        modal.hide();
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
      if (!Array.isArray(items)) {
        return;
      }
      
      items.forEach(function(item) {
        saveItem(item);
      });
    };
    
    self.deleteItems = function(items) {
      if (!Array.isArray(items)) {
        return;
      }
      
      items.forEach(function(item) {
        if (item.done) {
          deleteItem(item);
        }
      })
      
      return items.filter(function(item) {
        return !item.done;
      });
    };
    
    function deleteItem (item) {
      modal.show();
      $http.delete(API_URL + '/tasks/' + encodeURIComponent(item.id) + '.json')
      .then(function (success) {
        modal.hide();
      }, function(error) {
        modal.hide();
      });
    }
        
    function saveItem(item) {
      modal.show();
      save(item)
      .then(function (success) {
        item = success.data;
        item.isNew = false;
        modal.hide();
      }, function (error) {
        // todo: show error
        modal.hide();
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
      return $http.post(API_URL + '/tasks.json', formatItemForSave(item));
    }
    
    function update(item) {
      return $http.patch(
        API_URL + '/tasks/' + encodeURIComponent(item.id) + '.json',
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