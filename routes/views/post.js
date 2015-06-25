var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = locals.data || {};
	locals.data.posts = [];
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories tags');
		
		q.exec(function(err, result) {
			// console.log('>>> result.content.brief: ', result.content.brief);
			// console.log('>>> result.content.extended: ', result.content.extended);
			// TODO content.full === content.extended which is obviously wrong as it is missing brief
			// console.log('>>> result.content.full: ', result.content.full);
			locals.data.post = result;
			next(err);
		});
		
	});
	
	// // Load other posts
	// view.on('init', function(next) {
		
	// 	var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
	// 	q.exec(function(err, results) {
	// 		locals.data.posts = results;
	// 		next(err);
	// 	});
		
	// });
	
	// Render the view
	view.render('post');
	
};


