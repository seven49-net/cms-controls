///////////////////////
// renderGallery 1.2
//////////////////////
seven49cms.renderGallery =  function(parameters) {
	var options  = {
		bucket: seven49cms.helper.getBucketName(),
		path: null,
		thumbWidth: "180",
		container: ".gallery1",
		wrapper: true,
		wrapperTag: "div",
		wrapperClass: "lightbox-gallery",
		awsRegion: seven49cms.vars.awsRegion,
		thumbContainerTag: "div",
		itemsPerRow: 0,
		endOfRowClass: "end-of-row",
		limit: 0,
		albumTitle_de: "Bild %1 von %2",
		albumTitle_fr: "Image %1 de %2",
		albumTitle_it: "Disegno %1 di %2",
		albumTitle_en: "Image %1 of %2"
	};
	$.extend(options, parameters);
	var langExtension = function(arr){

		var lang= seven49cms.helper.getLanguageString();
		var key,
		out = 'de';
		for (key in arr) {
			if (arr[key] === lang) {
				out = lang;
			}
		}
		return out;
	};
	if (options.path === null) {
		$(options.container).html('<b>Bitte Pfad in Parameter setzen {path: "pfad/zu/meinem/galerie/ordner"}</b>');
	} else {
		if (seven49cms.helper.awsSDKsupport()) {
			// format the path correctly
			if (options.path.indexOf('/') === 0) {
				options.path = options.path.substring(1);
			}
			if((options.path.length -1) !== options.path.lastIndexOf('/')) {
				options.path = options.path + "/";
			}
			// renderImages function
			var renderImages = function(pa) {
				AWS.config.update({
					accessKeyId: 'AKIAJ3CTMVV7WBH5CO2Q',
					secretAccessKey: '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'
				});

				AWS.config.region = pa.awsRegion;

				var params = {
					Bucket: pa.bucket, // required /
					Delimiter: '/',
					EncodingType: 'url',
					Marker: '',
					MaxKeys: 1000,
					Prefix: pa.path
				};

				var s3 = new AWS.S3({ sslEnabled: true });

				s3.listObjects(params, function (error, data) {
					if (error) {
						$(pa.container).html("<div class='ajaxError'><span class='error'>"+ error + "</span><span class='error-details'>"+ error.stack +"</span></div>");

					} else {
						//console.log(data);
						//console.log(data.Contents.length);
						var d = [];
						if (data.Contents.length > 1) {
							data.Contents.shift();

							var objects = data.Contents,
								allowed = /^jpg|jpeg|gif|png$/;

							for (var i=0, dataL = objects.length; i < dataL; i++) {
								// console.log(objects[i])
								var key = objects[i].Key,
									exten = key.split(".").pop().toLowerCase();
								if (key.lastIndexOf("__w_") === -1 && allowed.test(exten)) {
									d.push(objects[i]);
								}
							}
						}

						if (d.length) {
							var items = [],
							maxItemClass = (options.itemsPerRow) ? 'items-per-row' + options.itemsPerRow : 'items-per-row0';
							for (var e=0, dL = d.length; e < dL; e++) {
								var largeImgUrl  = d[e].Key,
									file = largeImgUrl.split("."),
									fileExten = file.pop(),
									thumbUrl = file.join("") + "__w_" +pa.thumbWidth + "__h_0." + fileExten,
									thumb = "<img class='thumb thumb"+(e+1)+"' src='/"+thumbUrl+"' alt='' />",
									endOfRow = (e+1) % pa.itemsPerRow === 0 ? ' ' + pa.endOfRowClass : '';

								items.push('<'+  pa.thumbContainerTag +' class="gallery-image gallery-image'+ (e+1) + endOfRow +'"><a href="/'+largeImgUrl+'" data-lightbox="'+pa.container.substr(1)+'">' + thumb + '</a></'+  pa.thumbContainerTag +'>');
								if ((e+1) % pa.itemsPerRow === 0) {
									items.push('<'+ pa.thumbContainerTag +' class="clear"></'+  pa.thumbContainerTag +'>');
								}
								if (pa.limit > 0 && pa.limit === (e+1)){
									return false;
								}
							}

							if(pa.wrapper) {
								items.unshift("<" + pa.wrapperTag +  " class='" + pa.wrapperClass + "'>");
								items.push("</" + pa.wrapperTag + ">");
							}
							//console.log(options.container);
							setTimeout(function(){

								$(pa.container).html(items.join(""));
								$(pa.container).addClass(pa.wrapperClass).addClass(maxItemClass);
							}, 200);
						}
					}
				});
			};

			var css = '<link id="lightbox-css" rel="stylesheet" type="text/css" href="//cdn.seven49.net/common/js/jquery/plugins/lightbox/css/lightbox.css" />';
			var js = '<script type="text/javascript" id="lightbox-js" src="//cdn.seven49.net/common/js/jquery/plugins/lightbox/js/lightbox.js"></script>';

			if ($('#lightbox-css').length === 0) {
				$('head').prepend(css);
			}
			if ($('#lightbox-js').length === 0) {
			$('head').append(js);
			}

			$(options.container).html(seven49cms.loader);

			if (typeof AWS === 'undefined') {
				seven49cms.helper.loadScript("https://sdk.amazonaws.com/js/aws-sdk-2.1.27.min.js", function(){
					renderImages(options);
				});
			} else {
				renderImages(options);
			}

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


		} else {
			var errLang =  langExtension(["de", "en"]);
			var errMsg = seven49cms.helper.messages.notSupported_en;
			if (errLang === "de")	{
				errMsg = seven49cms.helper.messages.notSupported_de;
			}
			$(options.container).html("<div class='no-support'>" + errMsg + "</div>");
		}
	}

};