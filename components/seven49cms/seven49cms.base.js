///////////////////////
// seven49cms version 1.0
//////////////////////

var seven49cms = seven49cms || {};
seven49cms = {
	loader: '<img class="ajaxLoader" src="http://cdn.seven49.net/common/images/loading/ajax-loader-2.gif">',
	helper: {
		messages: {
			notSupported_de: "Sie verwenden einen veralteten Browser mit Sicherheitsschwachstellen und können nicht alle Funktionen dieser Webseite nutzen.<a href='http://browser-update.org/update-browser.html' target='_blank'>Hier erfahren Sie, wie sie Ihren Browser aktualisieren können.</a>",
			notSupported_en: "Your browser is out of date. It has known security flaws and may not display all features of this and other websites. <a href='http://browser-update.org/update-browser.html' target='_blank'>Learn how to update your browser</a>"
		},
		getAndWriteContent: function(params,results) {
			/*
			 params = {
				queries: ".Object",
				childUrl: "/url/to/file.htm",
				element: $jQueryElement,
				counter: counterOfParent,
				headline: "h1.ContentTitle",
				errorMessage: "no data available",
				ajaxLoader: ".ajaxLoader",
				headlineTag: "h2",
				itemTag: "li",
				characters: 200,
				delimiter: "...",
				moreLink: false,
				linkText: "read more",
				linkTag: "p",
				linkTo: params.childUrl
			}
			*/
			var queries = params.queries.split(',');

				$.get(params.childUrl, function(data) {
					var content = [],
						cssClass ='',
						queryContent = [];

					for (var i = 0; i < queries.length; i++) {
						var $elem = $(data).find(queries[i]);
						if ($elem.length > 0) {
							var elemClasses = $elem.attr('class');

							if (elemClasses.indexOf('Text') > -1) {
								cssClass += 'hasText ';
								queryContent.push(seven49cms.helper.textExtractor($elem, {
									characters: params.characters,
									delimiter: params.delimiter,
									listDescriptionClass: params.listDescriptionClass
								}));
							} else if (elemClasses.indexOf('Image') > -1){
								cssClass += 'hasImage ';
								queryContent.push(seven49cms.helper.imageExtractor($elem, {
									characters: params.characters,
									delimiter: params.delimiter,
									listDescriptionClass: params.listDescriptionClass
								}));
							} else if (elemClasses.indexOf('Link') > -1) {
								queryContent.push(seven49cms.helper.linkExtractor($elem));
							} else {
								queryContent.push(seven49cms.helper.htmlExtractor($elem));
							}
						} else {
							queryContent.push("<div class='systemMessage'>"+params.errorMessage+"</div>");
						}
					}
					content.push("<"+params.itemTag + " class='"+ cssClass + "item item"+(params.counter + 1)+"'>");
					// set headline and opt. link
					content.push(seven49cms.helper.headliner(data,{
						headline: params.headline,
						linkHeadline: params.linkHeadline,
						headlineTag: params.headlineTag,
						link: params.childUrl
					}));
					content.push(queryContent.join(''));
					if (params.moreLink) {
						content.push(seven49cms.helper.moreLink({
							linkTag: params.linkTag,
							linkTo: params.childUrl,
							linkText: params.linkText
						}));
					}
					content.push("</"+params.itemTag + ">");
					// to ensure the correct order the content will be appended after the last request
					results[params.counter] = content.join('');

					if ((params.counter + 1) === params.total) {
						setTimeout(function(){
							(params.element).append(results.join(''));
							(params.element).find(params.ajaxLoader).remove();
						}, 100);

					}
				});

		},
		moreLink: function(params) {
			/* params = {
				linkTag: "p",
				moreClass: "more",
				linkTo: "/my-page.htm",
				linkText: "Read more"
			}
			*/
				return "<" + params.linkTag + " class='"+params.moreClass+"'><a href='"+params.linkTo+"'>" + params.linkText + "</a></"+params.linkTag+">";
		},
		headliner: function(data, params) {
			/* params = {
				headline: "h1.ContentTitle",
				linkHeadline: false,
				link: "",
				headlineTag: "h2"
				};
			*/
			var ht = $(data).find(params.headline).text();
			var headline = (params.linkHeadline) ? "<a href='"+params.link+"'>" + ht + "</a>" : ht;
			return "<" + params.headlineTag + ">" + headline + "</" + params.headlineTag + ">";
		},
		textExtractor: function(data,params) {
			/* params = {
				listDescriptionClass: "Description",
				characters: 200,
				delimiter: "..."
				};
			*/
			var out,
			text = data.text();
			if (text.length > 0 && params.characters !== 0) {
				out = text.substring(0, params.characters) + params.delimiter;
			} else {
				out = text;
			}
			return "<div class='"+ params.listDescriptionClass +"'>" +out + "</div>";
		},
		imageExtractor: function(data, params) {
			/* params = {
				imgClass: ""
				characters: 200,
				delimiter: "...",
				listDescriptionClass: "Description"
				};
			*/
			var out,
				img = "<div class='Image'>" + $(data).find('.ImageContainer').html() + "</div>",
				text = $(data).find('.ImageText').length === 0 ? null : $(data).find('.ImageText');
				if (text !== null) {
					text = seven49cms.helper.textExtractor(text,{
						characters: params.characters,
						delimiter: params.delimiter,
						listDescriptionClass: params.listDescriptionClass
					});
				}
				out = img + text;
				return out;
		},
		linkExtractor: function(data) {
			return "<div class='Link'>" + $(data).html() + "</div>";
		},
		htmlExtractor: function(data){
			return "<div class'html'>" + $(data).html() + "</div>";
		},
		rssPubDateExtractor: function(pubDate) {
			var date = new Date(pubDate);
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var out = [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()];

			return out;
		},
		rssContentExtracor: function(data) {
			var out;
			if ($(data).find('encoded').length) {
				// console.log($(this).find('encoded'));
				out = $(data).find('encoded').text();

			} else if ($(data).find('content\\:encoded').length) {
				// console.log('content\\:encoded');
				out = $(data).find('content\\:encoded').text();

			}
			return out;
		},
		error: function(jqXHR, exception) {
			var errorMessage;
			if (jqXHR.status === 0) {
				errorMessage = 'Could not connect to network (this might be due to a CORS problem).\n Verify Network.';
			} else if (jqXHR.status === 404) {
				errorMessage = 'Requested page not found. [404]';
			} else if (jqXHR.status === 500) {
				errorMessage = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				errorMessage = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				errorMessage = 'Time out error.';
			} else if (exception === 'abort') {
				errorMessage = 'Ajax request aborted.';
			} else {
				errorMessage = 'Uncaught Error.\n' + jqXHR.responseText;
			}
			return errorMessage;
		},
		awsSDKsupport: function() {
			var ua = navigator.userAgent.toLowerCase();
			var out = true;
			//console.log(ua);
			if (ua.indexOf('msie') > -1) {
				//old ie check
				if (ua.indexOf('msie 10') > -1) {
					out = true;
				} else {
					out = false;
				}
			}
			// chrome check
			else if (ua.indexOf('chrome') !== -1 && parseFloat(ua.substring(ua.indexOf('chrome') + 7).split(' ')[0]) < 28) {
				out = false;
			}
			// safari check
			 else if (ua.indexOf('safari') !== -1 && ua.indexOf('version') && parseFloat(ua.substring(ua.indexOf('version') + 8).split(' ')[0]) < 5.1) {
				 out = false;
			}
			// opera check
			else if (ua.indexOf('opera') !== -1 && parseFloat(ua.substring(ua.indexOf('version')+8).split(' ')[0]) < 17 ) {
				out = false;
			}
			// firefox check
			else if (ua.indexOf('firefox') != -1 && parseFloat(ua.substring(ua.indexOf('firefox') + 8)) < 23) {
				out = false;
			}
			return out;
		},
		getUAlanguage: function(){
			var language = window.navigator.userLanguage || window.navigator.language;
			return language;
		},
		loadScript: function(url, callback) {
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = url;

			// Attach handlers for all browsers
			var done = false;
			script.onload = script.onreadystatechange = function() {
				if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
					done = true;
					// Continue your code
					callback();
					// Handle memory leak in IE
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);
				}
			};
			head.appendChild(script);
		}

	}

};