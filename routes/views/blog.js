var keystone = require('keystone'),
		myUtils = require('../../libs/myutils');

exports = module.exports = function(req, res) {

	//req.flash('info', 'Some information!');
	var view = new keystone.View(req, res),
		locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
		tag: req.params.tag,
		search: req.query.search
	};

	locals.data = locals.data || {};
	locals.data.posts = [];

	// Load the current category/tags filter
	view.on('init', function(next) {
		if (req.params.category) {
			keystone.list('PostCategory')
				.model
				.findOne({ key: locals.filters.category })
				.exec(function(err, result) {
					locals.data.category = result;
					next(err);
				});
		} else if (req.params.tag) {
			keystone.list('PostTag')
				.model
				.findOne({key: locals.filters.tag})
				.exec(function(err, result) {
					locals.data.tag = result;
					next(err);
				});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function(next) {
		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories tags');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		} else if (locals.data.tag) {
			q.where('tags').in([locals.data.tag]);
		}

		// This is a temporary implementation, once we upgrade to the latest mongodb
		// we will use the mongo's built in full text search.
		if (locals.filters.search) {
			q.where({$or: [
				{'title': new RegExp(locals.filters.search, 'i')},
				{'content.brief': new RegExp(locals.filters.search, 'i')},
				{$and: [{'content.extendedType': 'html'}, {'content.extendedHTML': new RegExp(locals.filters.search, 'i')}]},
				{$and: [{'content.extendedType': 'markdown'}, {'content.extendedMarkdown.html': new RegExp(locals.filters.search, 'i')}]},
				{$and: [{'content.extendedType': 'jade'}, {'content.extendedJade': new RegExp(locals.filters.search, 'i')}]}
			]});
		}

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('blog');

};
