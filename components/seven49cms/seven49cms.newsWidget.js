seven49cms.newsWidget = function(url, params) {
	var options = $.extend({
		container: ".News",
		characters: "90",
		delimiter: "...",
		wrapperTag: "ul",
		wrapperClass: "NewsListing",
		itemTag: "li",
		itemClass: "news-item",
		moreNews: "Alle News",
		moreNewsLink: "/de/home/aktuelles1.htm",
		moreNewsTag: "span",
		moreNewsClass: "more",
		limit: 0
	}, params);
	$(options.container).append("<"+options.itemTag+" class='loader'>" + seven49cms.loader + "</"+options.itemTag+">");
	$.ajax({
		url: url,
		dataType: "xml",
		success: function(data){
			if ($(data).find('item').length > 0){
				var out = [];
				out.push('<'+options.wrapperTag+' class="'+options.wrapperClass+'">');
				$(data).find('item').each(function(c, item){
					var $i = $(item);
					var date = seven49cms.helper.rssPubDateExtractor($i.find('pubDate').text());
					var text = $i.find('description').text();
					if (text.length > options.characters) {
						text = text.substring(0, options.characters) + options.delimiter;
					}
					out.push('<'+options.itemTag+' class="'+options.itemClass+' '+options.itemClass+'-'+(c+1)+'"><div class="Date"><span class="Month">'+ date[1] +'</span><span class="Year">'+date[2]+'</span></div>' +
					'<div class="Abstract">'+'<a href="'+ options.moreNewsLink +'#news-item'+(c+1)+'">' + $i.find('title').text() + '</a><span class="Description">'+ text +'</span>'+'</div></'+options.itemTag+'>');
					//console.log(out);
					if (options.limit !== 0 && options.limit === (c+1)) {
						return false;
					}
				});
				out.push('</'+options.wrapperTag+'>');
				if (options.moreNews !== false) {
					out.push("<" + options.moreNewsTag + " class='" + options.moreNewsClass + "'><a href='" + options.moreNewsLink + "'>" + options.moreNews + "</a></" +options.moreNewsTag + ">");
				}
				setTimeout(function(){
					$(options.container).find('.loader').remove();
					$(options.container).append(out.join(""));
				}, 200);
			}
		},
		error: function() {
			setTimeout(function(){
				$(options.container).find('.loader').remove();
				$(options.container).html('<div class="error">Der entsprechende Feed konnte nicht aufgerufen werden</div>');
			}, 200);
		}
	});
};