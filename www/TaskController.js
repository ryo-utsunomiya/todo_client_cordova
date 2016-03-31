(function() {
  'use strict';
  
  function TaskController($scope, $timeout, TaskService) {
    var self = this;
    self.items = [];
    
    TaskService.getItems(function(items) {
      self.items = items;
    });
    
    self.newTask = function() {      
      self.items.push(TaskService.newTask());
    };
    
    self.focusInput = function(event) {
      $timeout(function() {
        var item = event.target.parentNode.querySelector('input[type="text"]');
        item.focus();
        item.select();
      });
    }

    self.clearCompleted = function() {
      var itemsToDelete = self.items.filter(function(item) {
        return item.done;
      });
      
      self.items = self.items.filter(function(item) {
        return !item.done;
      });
      
      itemsToDelete.forEach(function(item) {
        TaskService.deleteItem(item);
      });
    };
    
    self.save = function() {
      TaskService.saveItems(self.items);
    };
    
    self.selectedItem = -1;
  }

  angular.module(APP).controller(
      'TaskController',
      ['$scope', '$timeout', 'TaskService', TaskController]
    );
})();