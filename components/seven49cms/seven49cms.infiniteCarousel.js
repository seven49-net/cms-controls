seven49cms.infiniteCarousel = function(url, params) {
	var options = $.extend({
		container: ".Slider",
		itemTag: "li",
		itemClass: "carousel-item",
		customLink: "#",
		limit: 0
	}, params);
	$(options.container).append("<div class='loader'>" + seven49cms.loader + "</div>");
	$.ajax({
		url: url,
		dataType: "JSON",
		success: function(data){
			// var xmlData = $.parseXML(data);
// 			console.log(xmlData);
			if (data.length){

				var out = [];
				out.push("<div class='infiniteCarousel'><div class='wrapper'>");
				out.push('<ul>');

				for ( var i=0; i< data.length; i++) {
					var content = data[i].Content;
					var href = options.customLink;
					var img = $(content).find('.Image1 img')[0].outerHTML;
					out.push('<li class="'+options.itemClass+' '+options.itemClass+'-'+(i+1)+'"><a href="'+href+'">'+img+'</a></li>');

				}

				out.push('</div>');
				out.push('<a class="arrow back">&lt;</a><a class="arrow forward">&gt;</a>');
				out.push('</div>');
				//console.log(out.join(""));
				setTimeout(function(){
					$(options.container).find('.loader').remove();
					$(options.container).append(out.join(""));
					$(options.container).find('.infiniteCarousel').infiniteCarousel();

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