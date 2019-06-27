/*global jQuery, Handlebars, Router */
import {Controller} from './controller';
import {Storage} from "./Storage";
import {RestStorage} from "./RestStorage";
import {LocalStorage} from "./local-storage";

jQuery(function ($) {
	'use strict';

	const todoController = new Controller();

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	todoController.init();
});


