seven49cms.newsListing = function(url, params) {
	var options = $.extend({
		container: ".News",
		content: ".Object",
		wrapperTag: "ul",
		wrapperClass: "NewsListing",
		itemTag: "li",
		itemClass: "news-item",
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
				$(data).find('item').each(function(c){

					var date = seven49cms.helper.rssPubDateExtractor($(this).find('pubDate').text());

					var content = seven49cms.helper.rssContentExtracor($(this));

					var text = $(content).find(options.content).html();

					out.push('<'+options.itemTag+' class="'+options.itemClass+' '+options.itemClass+'-'+(c+1)+'" id="news-item'+(c+1)+'"><div class="Date"><span class="Day">'+ date[0]+'.</span><span class="Month">'+ date[1] +'.</span><span class="Year">'+date[2]+'</span></div>' +
					'<div class="Abstract">'+'<h2>'+ $(this).find('title').text() + '</h2><span class="Description">'+ text +'</span>'+'</div></'+options.itemTag+'>');
					//console.log(out);
					if (options.limit !== 0 && options.limit === (c+1)) {
						return false;
					}
				});
				out.push('</'+options.wrapperTag+'>');

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