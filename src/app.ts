/*global jQuery, Handlebars, Router */
import {Controller} from './controller';

jQuery(function ($) {
	'use strict';

	const todoController = new Controller();

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	todoController.init();
});


