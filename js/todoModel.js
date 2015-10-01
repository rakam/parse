/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function() {
  'use strict';

  Parse.initialize("XixwxAUzP89PWo1jArax1fLmHpGX0uwXnPBetaqK", "4DTlTF4UsOJCp5gAWUh9OmTo4GyaxBexqtWZpnhx");

  function fetchTodos(model) {
    var query = new Parse.Query(ParseTodoItem);
    query.find({
      success: function(results) {
        model.todos = results;
        model.inform();
        setTimeout(fetchTodos, 3000, model);
      },
      error: function(error) {
        setTimeout(fetchTodos, 3000, model);
      }
    });
  }

  var ParseTodoItem = Parse.Object.extend("ParseTodoItem", {
    // Instance methods
  }, {
    // Class methods
    new: function(title) {
      var parseTodoItem = new ParseTodoItem();
      parseTodoItem.set('title', title);
      parseTodoItem.set('completed', false);
      return parseTodoItem;
    }
  });

  var Utils = app.Utils;

  app.TodoModel = function(key) {
    this.key = key;
    this.todos = [];
    this.onChanges = [];
    fetchTodos(this);
  };

  app.TodoModel.prototype.subscribe = function(onChange) {
    this.onChanges.push(onChange);
  };

  app.TodoModel.prototype.inform = function() {
    this.onChanges.forEach(function(cb) {
      cb();
    });
  };

  app.TodoModel.prototype.addTodo = function(title) {
    var todoModel = this;
    var item = new ParseTodoItem.new(title);
    this.inform();
    item.save(null, {
      success: function(savedItem) {
        todoModel.todos = todoModel.todos.concat(savedItem);
        todoModel.inform();
      },
      error: function(savedItem, error) {}
    });
  };

  app.TodoModel.prototype.toggleAll = function(checked) {
    var todoModel = this;
    this.todos.map(function(todo) {
      todo.set('completed', checked);
    });
    this.inform();
    Parse.Object.saveAll(this.todos, {
      success: function(list) {
        todoModel.inform();
      },
      error: function(error) {},
    });
  };

  app.TodoModel.prototype.toggle = function(todoToToggle) {
    var todoModel = this;
    todoToToggle.set('completed', !todoToToggle.get('completed'));
    this.inform();
    todoToToggle.save(null, {
      success: function(savedItem) {
        todoModel.inform();
      },
      error: function(savedItem, error) {}
    });
  };

  app.TodoModel.prototype.destroy = function(todo) {
    this.todos = this.todos.filter(function(obj) {
      return obj !== todo;
    });
    this.inform();
    todo.destroy({
      success: function(myObject) {},
      error: function(myObject, error) {}
    });
  };

  app.TodoModel.prototype.save = function(todoToSave, text) {
    todoToSave.set('title', text);
    todoToSave.save(null);
    this.inform();
  };

  app.TodoModel.prototype.clearCompleted = function() {
    var deletedItems = [];
    this.todos = this.todos.filter(function(todo) {
      if (!todo.get('completed')) {
        return true;
      } else {
        deletedItems.push(todo);
        return false;
      }
    });
    Parse.Object.destroyAll(deletedItems);
    this.inform();
  };

})();
