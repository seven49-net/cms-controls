seven49cms.cmsGallery = function(params){
	if($('body').find('.app-gallery-cms').length) {
		var options  = {
			wrapper: true,
			wrapperTag: "div",
			wrapperClass: "lightbox-gallery",
			thumbContainerTag: "div",
			albumTitle_de: "Bild %1 von %2",
			albumTitle_fr: "Image %1 de %2",
			albumTitle_it: "Disegno %1 di %2",
			albumTitle_en: "Image %1 of %2"
		};
		$.extend(options, params);
		// get correct language script
		var langExtension = function(arr){
			var path = location.pathname;
			var lang = "de";
			if (path !== "/") {
				lang = path.substr(1, 2);
			}
			var key,
			out = 'de';
			for (key in arr) {
				if (arr[key] === lang) {
					out = lang;
				}
			}
			return out;
		};
		var css = '<link id="lightbox-css" rel="stylesheet" type="text/css" href="http://cdn.seven49.net/common/js/jquery/plugins/lightbox/css/lightbox.css" />';
		var js = '<script type="text/javascript" id="lightbox-js" src="http://cdn.seven49.net/common/js/jquery/plugins/lightbox/js/lightbox.js"></script>';



		if ($('#lightbox-css').length === 0) {
			$('head').prepend(css);
		}
		if ($('#lightbox-js').length === 0) {
		$('head').append(js);
		}

		var gallery = $('.app-gallery-cms');
		gallery.find('.Text span.app-gallery-cms').each(function(i) {
			var thumbWidth = $(this).attr('data-thumb-width');
			var items = [];
			$(this).parent('.Text').nextAll('.Image').each(function(e){
				var largeImgUrl = $(this).find('img').attr('src'),
				extension = largeImgUrl.split('.').pop();
				var largeImg = largeImgUrl;
				if (largeImgUrl.indexOf("__w_") > -1) {
					var img = largeImg.substring(0, largeImgUrl.indexOf("__w_"));
					largeImg = img + "." + extension;
					// console.log(largeImg)
				}
				var thumbUrl = largeImg.split('.');
				thumbUrl.pop();
					var thumb = "<img src='"+ thumbUrl.join(".") + "__w_" +thumbWidth + "__h_0."+ extension +"' alt='' />";
					items.push('<'+  options.thumbContainerTag +' class="gallery-image gallery-image'+ (e+1)+'"><a href="'+largeImgUrl+'" data-lightbox="app-gallery-cms-'+(i+1)+'">' + thumb + '</a></'+  options.thumbContainerTag +'>');

					$(this).remove();
			});

			if (options.wrapper) {
				items.unshift("<" + options.wrapperTag + " class='" + options.wrapperClass + "'>");
				items.push("</" + options.wrapperTag + ">");
			}
			$(items.join("")).insertAfter($(this).parent());



		});
		var lang = langExtension(["de", "it", "fr", "en"]);
		var label;
		switch (lang) {
		case "de":
			label = options.albumTitle_de;
			break;
		case "fr":
			label = options.albumTitle_fr;
			break;
		case "it":
			label=	options.albumTitle_it;
			break;
		case "en":
		default:
			label=	options.albumTitle_en;

		}
		setTimeout(function(){

			lightbox.option({
				albumLabel: label
			});
		},  1000);

	}

};