var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150, required: true, default: 'Enter brief here as text.' },
		extendedType: { type: Types.Select, options: 'html, markdown, jade', default: 'html' },
		extendedHTML: { type: Types.Html, wysiwyg: true, height: 200, dependsOn: {'content.extendedType': 'html'} },
		extendedMarkdown: { type: Types.Markdown, wysiwyg: true, height: 200, dependsOn: {'content.extendedType': 'markdown'} },
		extendedJade: { type: Types.Code, language: 'jade', wysiwyg: true, height: 200, dependsOn: {'content.extendedType': 'jade'} }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	tags: { type: Types.Relationship, ref: 'PostTag', many: true},
	hits: { type: Types.Number, default: 0}
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.schema.virtual('content.isExtended').get(function() {
	return this.content.extendedType ===  'html' && !!this.content.extendedHTML ||
					this.content.extendedType ===  'markdown' && !!(this.content.extendedMarkdown && this.content.extendedMarkdown.md) ||
					this.content.extendedType ===  'jade' && !!this.content.extendedJade;
});

Post.schema.virtual('content.extended').get(function() {
	return this.content.extendedType ===  'html' && this.content.extendedHTML ||
					this.content.extendedType ===  'markdown' && (this.content.extendedMarkdown && this.content.extendedMarkdown.html) ||
					this.content.extendedType ===  'jade' && this.content.extendedJade;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
