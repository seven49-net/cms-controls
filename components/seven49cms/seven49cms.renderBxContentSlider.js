seven49cms.renderBxContentSlider = function(json, params) {
	var options = $.extend({
		container: "#slider",
		initClass: "bxslider",
		slidesContainerTag: "ul",
		slideContainerTag: "li",
		slideClass: "sliderItem",
		heading: true,
		noText: "No content found",
		firstPanel: "img",
		imgClass: "img",
		textClass: "text",
		cssPath: "http://cdn.seven49.net/common/js/jquery/plugins/bxslider/jquery.bxslider.css",
		jsPath: "http://cdn.seven49.net/common/js/jquery/plugins/bxslider/jquery.bxslider.min.js",
		panelContainerClass: "Slide",
		fullWidthImage: false,
		absoluteUrl: false,
		overlaySpan: false,
		bxsliderConfig: {
				auto: true,
				autoControls: true,
				mode: 'fade'
			}

	}, params);

	var css = '<link id="bx-slider-default-css" rel="stylesheet" type="text/css" media="screen" href="'+options.cssPath+'" />';

	if ($('#bx-slider-default-css').length === 0) {
		$('head').append(css);
	}

	$.ajax({
		url: json,
		success: function(data) {

			$(options.container).html(seven49cms.loader);
			var items = [];
			var dLength = data.length;

			for (var i = 0; i < dLength; i++) {
				var $content = $(data[i].Content);
				var overlaySpan = (options.overlaySpan)? "<span class='overlay'></span>" : "";
				var img,text,slide;

				if ($content.find('.Image1').length) {
					var image = $content.find('.Image1 img').removeClass().parent().html();
					$content.find('.Image').remove();
					if (!options.heading) {
						$content.find('.ContentTitle').remove();
					}
					text = "<div class='" + options.textClass + "'>" + $content.html() + "</div>";
					if (options.fullWidthImage) {
						slide = "<div class='" + options.imgClass + "'>" + image + text + "</div>";
					} else {
						img = "<div class='" + options.imgClass + "'>" + image + "</div>";
						if (options.firstPanel === "img") {
							slide =  img + text;

						} else {
							slide = text + img;
						}
					}
				} else {
					img = "no image found";
					text = "please add an image";
				}
				var c = (i+1);

				items.push("<" + options.slideContainerTag +" class='"+options.slideClass+" "+options.slideClass+c+"'><div class='"+options.panelContainerClass+"'>" + slide + overlaySpan + "</div></" + options.slideContainerTag +">");
			}

			seven49cms.helper.loadScript(options.jsPath, function() {
				$(options.container).html($('<'+options.slidesContainerTag+' />', {
					"class": "bxslider",
					html: items.join("")
				}));
				$('.' + options.initClass).bxSlider(options.bxsliderConfig);
			});
		},
		dataType: "JSON",
		error: function(jqXHR, exception) {
			$(options.container).html("<div class='ajaxError'>"+ seven49cms.helper.error(jqXHR, exception) + "</div>");
		}
	});
};