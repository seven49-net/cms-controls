///////////////////////
// utilities: addHtmlToElement, addRssToElement, addJsonContentToElement, addJsonSingleContentToElement, languageCode, goToSearchPage, getQueryStringParameterByName, copyrightYear - deprecated: htmlToPdf, linkToSitemap
// version 1.1
//////////////////////
var utilities = {
	addHtmlToElement: function(selector, url,params) {
		var options = $.extend({
			prepend: false,
			func: false
		}, params);
		$.ajax({
			url: url,
			success: function (data) {
				if (options.prepend){
					$(selector).prepend(data);
				} else {
					$(selector).append(data);
				}
			}
		});
	},
	addRssToElement: function(selector, url, params) {
		var options = $.extend({
			wrapper: false,
			wrapperClass: "Item",
			prepend: false
		}, params);
		$.ajax({
			url: url,
			success: function (data) {
				var content = [];
				$(data).find('item').each(function(e){
					var temp;
					if ($(this).find('encoded').length){
						temp = $(this).find('encoded').text();
					} else if ($(this).find('content\\:encoded').length) {
						temp = $(this).find('content\\:encoded').text();
					}
					if (options.wrapper) {
						temp = "<div class='"+options.wrapperClass + " "+ options.wrapperClass + (e+1) +"'>" + temp + "</div>";
					}
					content.push(temp);
				});
				if (options.prepend){
					$(selector).prepend(content.join());
				} else {
					$(selector).append(content.join());
				}
			}
		});
	},
	addJsonContentToElement: function(selector, url, params) {
		var options = $.extend({
			specified: false, // can be a string with multiple selectors => ".text1|.object2"
			wrapperClass: "Item",
			wrapSpecified: false,
			prepend: false
		}, params);
		$.getJSON(url, function(data){
			var content= [];
			for( var i=0; i<data.length; i++ ) {
				if( data[i].Content != null ) {
					var cont = "<div class='"+options.wrapperClass+" " + options.wrapperClass + (i+1) +"'>" + data[i].Content + "</div>";
					if(options.specified) {
						var spec = options.specified.split("|");
						var specContent = [];
						for (var c = 0; c<spec.length; c++) {
							var temp = $(data[i].Content).find(spec[c]);
							specContent.push(temp[0].outerHTML);
						}
						cont = specContent.join("");
						if (options.wrapSpecified) {
							cont = "<div class='"+options.wrapperClass+" " + options.wrapperClass + (i+1) + "'>" + cont +"</div>";
						}
					}
					content.push( cont );
				}
			}
			if (options.prepend){
				$(selector).prepend(content.join(""));
			} else {
				$(selector).append(content.join(""));
			}
		});
	},
	addJsonSingleContentToElement: function(selector, url, params) {
		var options = $.extend({
			specified: false, // can be a string with multiple selectors => ".text1|.object2"
			wrapperClass: "Item",
			wrapSpecified: false,
			prepend: false,
			title: null,
			rank: 1
		}, params);
		$.getJSON(url, function(data){
			var content= [];
			var buildElement = function(d, e, p) {
				var out;
				//console.log(d);
				if(p.specified) {
					var spec = p.specified.split("|");
					var specContent = [];
					for (var c = 0; c<spec.length; c++) {
						var temp = $(d.Content).find(spec[c]);
						specContent.push(temp[0].outerHTML);
					}
					out = specContent.join("");
					if (p.wrapSpecified) {
						out = "<div class='"+p.wrapperClass+" " + options.wrapperClass +"1'>" + out +"</div>";
					}
				} else {
					out= "<div class='"+p.wrapperClass+" " + p.wrapperClass +"1'>" + d.Content + "</div>";
				}

				return out;
			};

			for( var i=0; i<data.length; i++ ) {

					if(options.title === null && (options.rank - 1) === i) {
						content = buildElement(data[i], i, {
							wrapperClass: options.wrapperClass,
							wrapSpecified: options.wrapSpecified,
							specified: options.specified
						});

						break;
					} else if(options.title !== null && data[i].Title === options.title) {
						content =  buildElement(data[i], i, {
							wrapperClass: options.wrapperClass,
							wrapSpecified: options.wrapSpecified,
							specified: options.specified
						});
						break;
					}
			}

			if (options.prepend){
				$(selector).prepend(content);
			} else {
				$(selector).append(content);
			}
		});
	},
	languageCode: function(defaultLang) {
		defaultLang = (defaultLang === undefined || defaultLang === null) ? "de" : defaultLang;
		var path = location.pathname;
		var lang;
		if (path === "/") {
			lang = defaultLang;
		} else {
			lang = path.substr(1, 2);
		}
		return lang;
	},
	goToSearchPage: function(textboxID) {
		location.href = '/'+ utilities.languageCode() +'/search.htm?searchQuery=' + document.getElementById(textboxID).value;
	},
	getQueryStringParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	copyrightYear: function(selector) {
		var date = new Date();
		setTimeout(function(){
			$(selector).text(date.getFullYear());
		}, 100);
	},
	logDebugMessage: function(message) {
		try {
			console.log(message);
		}
		catch (e) {
		}
	},
	htmlToPdf: function(params) {
		var options = $.extend({
			selector: ".UtilityFunctionsPdf a",
			url: "http://convertbeta.html2pdf.seven49.net/?url_to_render=",
			parameter: ""

		},params);
		var href= location.href;
		$(options.selector).attr('href',options.url + encodeURIComponent(href) + options.parameter);
	},
	linkToSitemap: function(params) {
		var options = $.extend({
			selector: "#UtilityFunctionsSitemap a"
		}, params);
		$(options.selector).attr('href', "/" + utilities.languageCode() + "/sitemap.htm");

	}
};