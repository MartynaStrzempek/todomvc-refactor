/*global jQuery, Handlebars, Router */
import { RestStorage } from './RestStorage'
import { LocalStorage } from './local-storage'
import { Storage } from './Storage';
import { uuid, pluralize, store } from "../utils/utils";
import { Todo } from '../types/types';
import { ENTER_KEY, ESCAPE_KEY } from "../consts/consts";
import { TodoModel } from "./model";

declare const Router: any;

enum StorageTypes {
	REST_STORAGE = 'REST_STORAGE',
	LOCAL_STORAGE = 'LOCAL_STORAGE'
}

jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	const allStorages: { [key in StorageTypes]: Storage} = {
		[StorageTypes.REST_STORAGE]: new RestStorage(),
		[StorageTypes.LOCAL_STORAGE]: new LocalStorage()
	}

	const selectedStorages: Set<Storage> = new Set([allStorages.REST_STORAGE, allStorages.LOCAL_STORAGE]);
	const todoModel = new TodoModel();

	var App = {
		init: function () {
			todoModel.setTodos(store('todos-jquery'));
			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.bindEvents();

			new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');
		},
		bindEvents: function () {
			$('#new-todo').on('keyup', this.create.bind(this));
			$('#toggle-all').on('change', this.toggleAll.bind(this));
			$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			$('#todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('dblclick', 'label', this.edit.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
			$('#localStorageCheckbox')
				.change((event) => this.toggleStorageInSelected(event, allStorages.LOCAL_STORAGE));
			$('#restStorageCheckbox')
				.change((event) => this.toggleStorageInSelected(event, allStorages.REST_STORAGE));
		},
		toggleStorageInSelected(event, storage: Storage) {
				const checkedInput = (<HTMLInputElement>(event.target)).checked
				if (checkedInput) {
					selectedStorages.add(storage)						
				} else {
					selectedStorages.delete(storage)
				}
		},
		render: function () {
			const visibleTodos = todoModel.getFilteredTodos(this.filter);
			$('#todo-list').html(this.todoTemplate(visibleTodos));
			$('#main').toggle(visibleTodos.length > 0);
			$('#toggle-all').prop('checked', todoModel.getActiveTodos().length === 0);
			this.renderFooter();
			$('#new-todo').focus();
			store('todos-jquery', todoModel.getTodos());
		},
		renderFooter: function () {
			const todoCount = todoModel.getTodos().length;
			const activeTodoCount = todoModel.getActiveTodos().length;
			const template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: this.filter
			});

			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			const isChecked = $(e.target).prop('checked');

			todoModel.getTodos().forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		destroyCompleted: function () {
			todoModel.setTodos(todoModel.getActiveTodos());
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) { //read
			const id = $(el).closest('li').data('id');
			let i = todoModel.getTodos().length;

			while (i--) {
				if (todoModel.getTodos()[i].id === id) {
					return i;
				}
			}
		},
		create: function (e) {
			const $input = $(e.target);
			const val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			const newTodo: Todo = {
				id: uuid(),
				title: val,
				completed: false
			}
			this.todos.push(newTodo);
			selectedStorages.forEach(storage => { storage.createTodo(newTodo) })

			$input.val('');

			this.render();
		},
		toggle: function (e) {
			const i = this.indexFromEl(e.target);
			todoModel.getTodos()[i].completed = !todoModel.getTodos()[i].completed;
		this.render();
		},
		edit: function (e) {
			const $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
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
				todoModel.getTodos()[this.indexFromEl(el)].title = val;
			}

			this.render();
		},
		destroy: function (e) {
			const todoToDestroyIndex = this.indexFromEl(e.target);
			const todoToDestroy = this.todos[todoToDestroyIndex];
			this.todos.splice(todoToDestroyIndex, 1);
			selectedStorages.forEach(storage => storage.destroy(todoToDestroy.id))
			this.render();
		}


	};

	App.init();
});


