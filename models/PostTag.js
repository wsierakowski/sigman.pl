var keystone = require('keystone');

/**
 * PostTag Model added on top of the template provided
 */

var PostTag = new keystone.List('PostTag', {
	autokey: {from: 'name', path: 'key', unique: true}
});

PostTag.add({name: {type: String, required: true}});

PostTag.relationship({ref: 'Post', path: 'tags'});

PostTag.register();
