/*global jQuery, Handlebars, Router */
import { RestStorage } from './RestStorage'
import { Storage } from './Storage';
import { uuid, pluralize, store } from "../utils/utils";
import { ENTER_KEY, ESCAPE_KEY } from "../consts/consts";

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
		[StorageTypes.LOCAL_STORAGE]: new RestStorage()
	}

	const storage: Storage = allStorages.REST_STORAGE

	var App = {
		init: function () {
			this.todos = store('todos-jquery');
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
				.change(function() {
					console.log('localStorageCheckbox', $(this).prop('checked'));
				});
			$('#restStorageCheckbox')
				.change(function() {
					console.log('restStorageCheckbox', $(this).prop('checked'));
				});
		},
		render: function () {
			const visibleTodos = this.getFilteredTodos();
			$('#todo-list').html(this.todoTemplate(visibleTodos));
			$('#main').toggle(visibleTodos.length > 0);
			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			$('#new-todo').focus();
			store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			const todoCount = this.todos.length;
			const activeTodoCount = this.getActiveTodos().length;
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

			this.todos.forEach((todo) => {
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) { //read
			const id = $(el).closest('li').data('id');
			let i = this.todos.length;

			while (i--) {
				if (this.todos[i].id === id) {
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

			this.todos.push({
				id: uuid(),
				title: val,
				completed: false
			});

			$input.val('');

			this.render();
		},
		toggle: function (e) {
			const i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
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
				this.todos[this.indexFromEl(el)].title = val;
			}

			this.render();
		},
		destroy: function (e) {
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		}
	};

	App.init();
});
