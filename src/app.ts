/*global jQuery, Handlebars, Router */
import {Controller} from './controller';


// enum StorageTypes {
// 	REST_STORAGE = 'REST_STORAGE',
// 	LOCAL_STORAGE = 'LOCAL_STORAGE'
// }

jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	// const allStorages: { [key in StorageTypes]: Storage} = {
	// 	[StorageTypes.REST_STORAGE]: new RestStorage(),
	// 	[StorageTypes.LOCAL_STORAGE]: new LocalStorage()
	// };

	const todoController = new Controller();

	todoController.init();
});


