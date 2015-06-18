/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
	async = require('async'),
	keystone = require('keystone');


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;

	locals.curYear = new Date().getFullYear().toString();
	locals.title = keystone.get('name');

	locals.navLinks = [];
	locals.navLinks.push({ label: 'Latests',		key: 'latests',		href: '/' });

//---------------------------------------------------------------------//////////////////
	keystone.list('PostCategory').model.find().sort('name').exec(function(err, categories) {
		if (err) {
			return next(err);
		}

		_.each(categories, function(cat) {
			locals.navLinks.push({ label: cat.name, key: cat.key, href: '/' + cat.key });
		});

		locals.navLinks.push({ label: 'About',		key: 'about',		href: '/about' });

		locals.user = req.user;
		next();

	});
//---------------------------------------------------------------------//////////////////
		//{ label: 'Home',		key: 'home',		href: '/' },
		//{ label: 'Blog',		key: 'blog',		href: '/blog' },
	
		//{ label: 'Contact',		key: 'contact',		href: '/contact' }
		
	
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};

exports.fetchCategories = function(req, res, next) {

	var locals = res.locals;
	locals.data = locals.data || {};
	locals.data.categories = [];

	keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {
		if (err) {
			return next(err);
		}

		locals.data.categories = results;

		// Load the counts for each category
		async.each(locals.data.categories, function(category, cb) {
			keystone.list('Post').model.count().where('categories').in([category.id]).exec(function(err, count) {
				category.postCount = count;
				cb(err);
			});
		}, function(err) {
			next(err);
		});
	});
};
