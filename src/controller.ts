import { ENTER_KEY, ESCAPE_KEY } from "../consts/consts";
import { pluralize, store, uuid } from "../utils/utils";
import { TodoModel } from "./model";
import { Filter } from "../types/types";

declare const Router: any;
const todoModel = new TodoModel();

export class Controller {
  filter: Filter = "all";
  todoTemplate = Handlebars.compile($('#todo-template').html());
  footerTemplate = Handlebars.compile($('#footer-template').html());

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
      .change(function() {
        console.log('localStorageCheckbox', $(this).prop('checked'));
      });
    $('#restStorageCheckbox')
      .change(function() {
        console.log('restStorageCheckbox', $(this).prop('checked'));
      });
  }

  render() {
    const visibleTodos = todoModel.getFilteredTodos(this.filter);
    $('#todo-list').html(this.todoTemplate(visibleTodos));
    $('#main').toggle(visibleTodos.length > 0);
    $('#toggle-all').prop('checked', todoModel.getActiveTodos().length === 0);
    this.renderFooter();
    $('#new-todo').focus();
    store('todos-jquery', todoModel.getTodos());
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

    todoModel.setTodos([...todoModel.getTodos(),
      {
        id: uuid(),
        title: val,
        completed: false
      }
    ]);

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
    todoModel.getTodos().splice(Controller.indexFromEl(e.target), 1);
    this.render();
  }
}