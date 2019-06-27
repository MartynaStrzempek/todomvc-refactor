import { ENTER_KEY, ESCAPE_KEY } from "../consts/consts";
import { pluralize, store, uuid } from "../utils/utils";
import { TodoModel } from "./model";
import { Filter, Todo } from "../types/types";
import { SyncMultipleStorage } from "./SyncMultipleStorage";
import * as $ from "jquery"

declare const Router: any;
const todoModel = new TodoModel();

export class Controller {
  filter: Filter = "all";
  todoTemplate = Handlebars.compile($('#todo-template').html());
  footerTemplate = Handlebars.compile($('#footer-template').html());
  syncMultipleStorage = new SyncMultipleStorage();

  init() {
    todoModel.setTodos(store('todos-jquery'));
    this.bindEvents();

    new Router({
      '/:filter': (filter) => {
        this.filter = filter;
        this.render();
      }
    }).init('/all');
  }

  bindEvents() {
    $('#new-todo').on('keyup', this.create.bind(this));
    $('#toggle-all').on('change', this.toggleAll.bind(this));
    $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
    $('#todo-list')
      .on('change', '.toggle', this.toggle.bind(this))
      .on('dblclick', 'label', Controller.edit.bind(this))
      .on('keyup', '.edit', Controller.editKeyup.bind(this))
      .on('focusout', '.edit', this.update.bind(this))
      .on('click', '.destroy', this.destroy.bind(this));
    $('#localStorageCheckbox')
      .change((event) => this.syncMultipleStorage.toggleStorageInSelected(event, this.syncMultipleStorage.allStorages.LOCAL_STORAGE));
    $('#restStorageCheckbox')
      .change((event) => this.syncMultipleStorage.toggleStorageInSelected(event, this.syncMultipleStorage.allStorages.REST_STORAGE));
  }

  render() {
    const visibleTodos = todoModel.getFilteredTodos(this.filter);
    $('#todo-list').html(this.todoTemplate(visibleTodos));
    $('#main').toggle(visibleTodos.length > 0);
    $('#toggle-all').prop('checked', todoModel.getActiveTodos().length === 0);
    this.renderFooter();
    $('#new-todo').focus();
  }

  renderFooter() {
    const todoCount = todoModel.getTodos().length;
    const activeTodoCount = todoModel.getActiveTodos().length;
    const template = this.footerTemplate({
      activeTodoCount: activeTodoCount,
      activeTodoWord: pluralize(activeTodoCount, 'item'),
      completedTodos: todoCount - activeTodoCount,
      filter: this.filter
    });

    $('#footer').toggle(todoCount > 0).html(template);
  }

  create(e) {
    const $input = $(e.target);
    const val = $input.val().trim();

    if (e.which !== ENTER_KEY || !val) {
      return;
    }

    const newTodo: Todo = {
      id: uuid(),
      title: val,
      completed: false
    };
    todoModel.setTodos([...todoModel.getTodos(), newTodo]);
    this.syncMultipleStorage.createTodo(newTodo);

    $input.val('');

    this.render();
  }

  toggle(e) {
    const i = Controller.indexFromEl(e.target);
    todoModel.getTodos()[i].completed = !todoModel.getTodos()[i].completed;
    this.render();
  }

  static edit(e) {
    const $input = $(e.target).closest('li').addClass('editing').find('.edit');
    $input.val($input.val()).focus();
  }

  toggleAll(e) {
    const isChecked = $(e.target).prop('checked');

    todoModel.getTodos().forEach(function (todo) {
      todo.completed = isChecked;
    });

    this.render();
  }

  destroyCompleted() {
    this.syncMultipleStorage.destroyCompleted(todoModel.getFilteredTodos('completed'));
    todoModel.setTodos(todoModel.getActiveTodos());
    this.filter = 'all';
    this.render();
  }

  static indexFromEl(el) {
    const id = $(el).closest('li').data('id');
    let i = todoModel.getTodos().length;

    while (i--) {
      if (todoModel.getTodos()[i].id === id) {
        return i;
      }
    }
  }

  static editKeyup(e) {
    if (e.which === ENTER_KEY) {
      e.target.blur();
    }

    if (e.which === ESCAPE_KEY) {
      $(e.target).data('abort', true).blur();
    }
  }

  update(e) {
    const el = e.target;
    const $el = $(el);
    const val = $el.val().trim();

    if (!val) {
      this.destroy(e);
      return;
    }

    if ($el.data('abort')) {
      $el.data('abort', false);
    } else {
      todoModel.getTodos()[Controller.indexFromEl(el)].title = val;
    }

    this.render();
  }

  destroy(e) {
    const todos = todoModel.getTodos();
    const todoToDestroyIndex = Controller.indexFromEl(e.target);
    const todoToDestroy = todos[todoToDestroyIndex];
    todos.splice(todoToDestroyIndex, 1);
    this.syncMultipleStorage.destroy(todoToDestroy.id);
    this.render();
  }
}