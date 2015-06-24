var _ = require('underscore');

module.exports = {
	getUrl: function() {
		var urls = Array.prototype.slice.call(arguments);
		//console.log('IN--->', urls);

		urls = _.isString(urls) ? [urls] : urls;
		urls = _.compact(urls);

		if (urls.length === 1 && urls[0] === '/') return urls[0];


		var ret = '';
		_.each(urls, function(url) {
			if (url !== '/') ret += '/' + url;
		});
		//console.log('OUT--->', ret, '\n');
		return ret;
	}
};
