seven49cms.renderSubcontentsNavlist = function(urlid, params) {
	var options = $.extend({
		container: ".link-list",
		title: null,
		titleTag: "h3",
		language: null,
		navClass: "nav"
	}, params);
	function getUrlId () {
		var urlID = location.pathname.split('/').pop().split('.');
		return urlID[0];
	}
	function getLang(){
		var path =	location.pathname.split('/');
		if (path[1].indexOf('_temp') > -1) {
			return path[2];
		} else {
			return path[1];
		}
	}
	urlid = (urlid === null) ? getUrlId() : urlid;
	var lang = (options.language === null) ? getLang() : options.language;
	$.get("/sitemap/" + lang + ".htm", function(data) {
		var container = $(options.container);
		container.append("<li class='loader'>" + seven49cms.loader + "</li>");
		var children = $(data).find('li.item_' + urlid + ' ul');
		$(children).find('ul ul').remove();

		var title = (options.title === null) ? "" : "<" + options.titleTag + ">" + options.title + "</"  + options.titleTag +">";

		setTimeout(function(){
			container.find('li.loader').remove();
			container.append( title + "<ul class='"+options.navClass+"'>" + children.html() + "</ul>");

		}, 100);
	});
};