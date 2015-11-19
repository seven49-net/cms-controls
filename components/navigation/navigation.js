///////////////////////
// navigation method contains all navigation cases found in typical seven49.net websites
// version 2.2
//////////////////////
var navigation = {
	extractLanguage: function(defaultLang){
		defaultLang = (defaultLang === undefined || defaultLang === null) ? "de" : defaultLang;
		var path = location.pathname;
		var lang;
		if (path === "/") {
			lang = defaultLang;
		} else if (path.indexOf('/_temp/') > -1) {
			lang = path.substr(7, 2);
		} else {
			lang = path.substr(1, 2);
		}
		return lang;
	},
	removeFirstPageEqualToCategory: function(data) {
		$(data).children('li').each(function(){
			if ($(this).children('ul').length) {
				var catLinkText = $(this).children('a').text();
				var pageLinkText = $(this).children('ul').children('li:first-child').children('a').text();
				if (catLinkText === pageLinkText) {
					$(this).children('ul').children('li:first-child').remove();
				}
			}

		});
	},
	getUrlID: function(){
		var path = location.pathname;
		return path.split('/').pop().split('.').shift();
	},
	testPath: function(p) {
		var names = ["sitemap.htm", "login-check.htm", "login.htm", "profile.htm", "search.htm"];
		var test = 0;
		for (var i = 0, len = names.length; i < len; i++) {
			if (p.indexOf(names[i]) === -1) {
				test += 1;
			}
		}

		return  (test === names.length) ? true : false;

	},
	getMainCategory: function() {
		var path = window.location.pathname;
		var mainCat = null;

		if (navigation.testPath(path)) {

			var segments = path.split('/');
			segments.shift();

			if (path.indexOf('/_temp/') > -1) {
				mainCat = segments[2];
			} else {
				mainCat = segments[1];
			}
		}
		return mainCat;
	},
	getUrlSegmentsAndLength: function() {
		var path = window.location.pathname;
		var segments = null, segLen = 0;
		if (navigation.testPath(path)) {
			segments = path.split("/");
			segments.shift();
			if (path.indexOf('/_temp/') > -1) {
				segments = segments.splice(0,2);
				segLen = segments.length;
			} else {
				segments.shift();
				segLen = segments.length;
			}
		}
		return [segments, segLen];
	},
	current: function(params){
		var options = $.extend({
			urlID: navigation.getUrlID(),
			currentClass: "selected",
			container: ".MainNavigation",
			defaultCategory: ".item1.category"
		}, params);

		var category = navigation.getMainCategory(),
		segments = navigation.getUrlSegmentsAndLength()[0],
		segLen = navigation.getUrlSegmentsAndLength()[1];

		if(category !== null) {
			var $branch = $(options.container).find('.item_' + category);
			$branch.addClass(options.currentClass);
			if (segments !== null && segLen >= 2) {
				for (var i=0,len = segLen -1; i < len; i++){
					$branch.find('.item_' + segments[i]).addClass(options.currentClass);
				}
				$branch.find('.item_' + options.urlID).addClass(options.currentClass);
			}
		} else {
			if (options.defaultCategory !== null) {
				$(options.container).find(options.defaultCategory).addClass(options.currentClass);
			}
		}

	},
	mainNavigation: function(params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: ".MainNavigation",
			container2: ".root",
			defaultLanguage: "de",
			removeMainFirstEqualItem: false,
			rootClass: "root",
			onlyOneSubLevel: false,
			legacyHover: false,
			megaPanel: false,
			megaPanelClass: "MegaPanel",
			currentClass: "selected",
			subNavigation: false,
			subContainer: ".TreeNavigation",
			subClass: "sub-level",
			subShowMainCategory: true,
			emptyMainContentNav: false,
			emptyContainerClass: "ContentSubNav",
			emptySelector: ".ObjectsCountNull",
			mobileMenu: false,
			mobileContainer: "#mobileMenu",
			mobileHideSubLevel: true,
			mobileCurrentClass: "selected",
			mobileCustomElements: false,
			mobileLanguageSelection: false,
			mobileLanguagePrepend: true,
			crumbs: false,
			crumbsContainer: ".breadcrumbs",
			languageNavigation: false,
			languageContainer: ".LanguageSelection",
			languageNoWrap: false,
			emptyMainContentNavigationExtended: false,
			emptyMainContentNavigationExtendedFilePath: null,
			emptyMainContentNavigationExtendedUppercase: false,
			emptyMainContentNavigationExtendedFileExtension: "jpg"
		},params);

		var lang = this.extractLanguage(options.defaultLanguage);
		$.ajax({
			url: "/sitemap/" + lang + ".htm",
			success: function(data) {
				var nav =  $(data);
				$(nav).find('.selected').removeClass('selected');
				if (options.removeMainFirstEqualItem) {
					$(nav).children('li').each(function(){
						if ($(this).children('ul').length) {
							var catLinkText = $(this).children('a').text();
							var pageLinkText = $(this).children('ul').children('li:first-child').children('a').text();
							if (catLinkText === pageLinkText) {
								$(this).children('ul').children('li:first-child').remove();
							}
						}

					});
				}
				if (options.megaPanel) {
					$(nav).children('li').each(function(){
						if ($(this).children('ul').length) {
							$(this).children('ul').wrap('<div class="'+options.megaPanelClass+'"></div>');
						}
					});
				}
				$(options.container).append("<ul class='"+ options.rootClass +"'>" + $(nav).html() + "</ul>");

				// mark selected
				navigation.current({
					urlID: options.urlID,
					container: options.container,
					currentClass: options.currentClass
				});

				if (options.onlyOneSubLevel) {
					$(options.container).find('ul ul ul').remove();
				}

				if (options.legacyHover) {
					navigation.legacyHover(options.container);
				}
				if (options.subNavigation) {
					navigation.subNavigation(data, {
						urlID: options.urlID,
						container: options.subContainer,
						currentClass: options.currentClass,
						subClass: options.subClass,
						showMainCategory: options.subShowMainCategory
					});
				}
				if (options.emptyMainContentNav) {
					navigation.emptyMainContentNavigation(data, {
						urlID: options.urlID,
						containerClass: options.emptyContainerClass,
						selector: options.emptySelector
					});
				}
				if (options.mobileMenu) {
					navigation.mobileMenu(data, {
						urlID: options.urlID,
						container: options.mobileContainer,
						currentClass: options.mobileCurrentClass,
						customElements: options.mobileCustomElements,
						hideSubLevel: options.mobileHideSubLevel,
						languageSelection: options.mobileLanguageSelection,
						languagePrepend: options.mobileLanguagePrepend
					});
				}
				if (options.crumbs) {
					navigation.breadcrumbs(data,{
						container: options.crumbsContainer
					});
				}
				if (options.languageNavigation) {
					navigation.languageNavigation(data, {
						urlID: options.urlID,
						container: options.languageContainer,
						noWrap: options.languageNoWrap
					});
				}

				if(options.emptyMainContentNavigationExtended) {
					navigation.emptyMainContentNavigationExtended(data, {
						filePath: options.emptyMainContentNavigationExtendedFilePath,
						uppercase: options.emptyMainContentNavigationExtendedUppercase,
						fileExtension: options.emptyMainContentNavigationExtendedFileExtension
					});
				}
			}
		});
	},
	subNavigation: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: ".TreeNavigation",
			currentClass: "selected",
			noSubNavClass: "no-sub-nav",
			emptyClass: "empty-sub-nav",
			rootClass: "sub-level",
			showMainCategory: true,
			showRootParentLink: true
		}, params);
		var urlID = options.urlID;
		var treeData = $(data);
		navigation.removeFirstPageEqualToCategory(treeData);

		var treeNavigation = null;

		var category = navigation.getMainCategory();

		if (category !== null && treeData.find('li.item_' + category + ' li').length) {
			treeNavigation = $(treeData).find('li.category.item_' + category)[0].outerHTML;
		}
		if (treeNavigation !== null) {
			if (options.showMainCategory) {
				treeNavigation = '<ul class="'+ options.rootClass +'">' + treeNavigation + '</ul>';
			} else {
				treeNavigation = $(treeNavigation).children('ul')[0].outerHTML;
			}


			$(options.container).append(treeNavigation);
			// mark selected
			if ($(options.container).find('.item_' + urlID).length) {

				$(options.container).find('.item_' + urlID).addClass(options.currentClass);
			} else if ($(options.container).find('.firstpage_' + urlID).length) {
				$(options.container).find('.firstpage_' + urlID).addClass(options.currentClass);
			}
			$(options.container).find('.' + options.currentClass ).parents('li').addClass(options.currentClass);

			if (!options.showRootParentLink) {
				$(options.container).find('li.category.' + options.currentClass + '> a').remove();
			}
			//mark all selected li>a as selected
			$(options.container).find('li.' + options.currentClass).children('a').addClass(options.currentClass);

		} else {
			$(options.container).addClass(options.emptyClass);
			$("body").addClass(options.noSubNavClass);
		}
	},
	mobileMenu: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: "#mobileMenu",
			currentClass: "selected",
			customElements: false,
			hideSubLevel: true,
			languageSelection: false,
			languagePrepend: true
		}, params);

		// build  menu
		var mobileNav = $(data);

		if (options.customElements) {
			var elements = options.customElements.split("||");
			for (var i = 0; i < elements.length; i++) {
				$(mobileNav).append(elements[i]);
			}
		}

		if (options.hideSubLevel) {
			if (mobileNav.find('li.multichild').length) {
				mobileNav.find('li.multichild > ul').hide();
				$('<span class="open-close-button closed">+</span>').insertAfter(mobileNav.find('li.multichild>a'));
			}
			if (mobileNav.find('li.parent').length) {
				mobileNav.find('li.parent > ul').hide();
				$('<span class="open-close-button closed">+</span>').insertAfter(mobileNav.find('li.parent>a'));
			}
		}

		// first remove all selected classes
		mobileNav.find('.selected').removeClass('selected');
		// insert mobile main nav
		$(options.container).append('<ul class="mobile-nav">' + mobileNav.html() + '</ul>');

		// insert language selection
		if (options.languageSelection) {
			var mobileLang = $('<div class="mobile-language-selection"></div>');
			if (options.languagePrepend) {
				$(options.container).prepend(mobileLang);
			} else {
				$(options.container).append(mobileLang);
			}
			navigation.languageNavigation(data,{
				container: options.container + ' .mobile-language-selection',
				urlID: options.urlID
			});
		}

		// determine selected state
		navigation.current({
			urlID: options.urlID,
			currentClass: options.currentClass,
			container: options.container
		});

		// ope/close logic
		$('.open-close-button').click(function() {
			$(this).siblings('ul').slideToggle();
			$(this).parent('li').toggleClass('open');
			if ($(this).hasClass('closed')) {
				$(this).removeClass('closed').text('-');

			} else {
				$(this).addClass('closed').text('+');

			}
		});
	},
	breadcrumbs: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: ".breadcrumbs",
			prependHome: false,
			currentClass: "current"
		}, params);
		var crumbsData = $(data),
		out = [],
		urlID =options.urlID,
		prependHome;

		if (options.prependHome) {
			var home = $(crumbsData).find('li.category.item1');
			prependHome ="<li class='"+$(home).attr('class')+" crumbs0 crumb home-prepended'><a href='"+$(home).children('a').attr('href')+"'>" + $(home).children('a').text() + "</a></li>";
		}

		var category = navigation.getMainCategory(),
		path = window.location.pathname,
		segments = [], segLen = 0;
		if (navigation.testPath(path)) {
			segments = path.split("/");
			segments.shift();
			if (path.indexOf('/_temp/') > -1) {
				segments = segments.splice(0,2);
				segLen = segments.length;
			} else {
				segments.shift();
				segLen = segments.length;
			}
		}
		var $crumbs = null;
		if (category !== null && segLen >= 2) {
			$crumbs = $(crumbsData).find('.category.item_' + category);
			if ($crumbs.hasClass('firstpage_' + urlID) && $crumbs.hasClass('item_' + category)) {
				out.push('<li class="'+$crumbs.attr("class")+' crumbs1 crumb last '+options.currentClass+'"><a href="'+$crumbs.children("a").attr("href")+'">' + $crumbs.children("a").text() + '</a></li>');
			} else {
				for (var i = 0, len = segLen -1; i < len; i++) {
					var $crumb = (i === 0) ? $crumbs : $crumbs.find('.item_' + segments[i]);
					out.push('<li class="'+$crumb.attr('class')+' crumb crumbs'+(i+1)+'"><a href="'+$crumb.children("a").attr("href")+'">' + $crumb.children("a").text() + '</a></li>');

				}
				var $last = $crumbs.find('.item_' + urlID);
				out.push('<li class="'+$last.attr('class')+' last crumb crumbs'+ segLen +' '+options.currentClass+'"><a href="'+$last.children("a").attr("href")+'">' + $last.children("a").text() + '</a></li>');
			}

			if (options.prependHome) {
				out.unshift(prependHome);
			}
			if (out.length >= 1 && options.prependHome === false || options.prependHome === true) {
				out.unshift('<ul>');
				out.push('</ul>');
			} else {
				out = [];
			}
			$(options.container).append(out.join(""));
		}
	},
	languageNavigation: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: ".LanguageSelection",
			currentClass: "selected",
			noWrap: false,
			prepend: false
		}, params);
		var currentLang = navigation.extractLanguage(),
			$container = $(options.container),
			currentCat = $(data).find('li.item1.category'),
			category = navigation.getMainCategory();

		$.getJSON( "/sitemap/languages.json", function(jLang) {
			var out = [];
			if (category !== null) {
				currentCat = $(data).find('.category.item_' + category);
			}
			for (var i=0, len = jLang.length; i<len; i++) {
				var langCode = jLang[i].IsoCode2,
				langTitle = jLang[i].Title,
				listItem;
				if (currentLang === langCode) {
					listItem = "<li class='lang-" + langCode +" " +options.currentClass + "'><a href='" + currentCat.children('a').attr('href') + "'>" + langTitle + "</a></li>";
				} else {

					listItem = "<li class='lang-" + langCode +"'><a href='" + currentCat.children('a').attr('data-rel-' + langCode) + "'>" +langTitle + "</a></li>";
				}

				out.push(listItem);
			}
			if (out.length > 1) {
				if (options.noWrap) {
					out = out.join("");
				} else {
					out = '<ul>' + out.join("") + '</ul>';
				}
				if (options.prepend) {
					$container.prepend(out);
				} else {
					$container.append(out);
				}
			}
		});
	},
	legacyHover: function(selector) {
		$(selector + ' > ul > li').hover(function(){
			$(this).find('ul').css({
				"visibility": "visible",
				"display": "block"
			});
		}, function() {
			$(this).find('ul').css({
				"visibility": "hidden",
				"display": "none"
			});
		});
	},
	emptyMainContentNavigation: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			containerClass: "ContentSubNav",
			selector: ".ObjectsCountNull",
			emptyMainContentNavigation: false,
			itemClass: "Item"
		},params);
		var category = navigation.getMainCategory();
		if (category !== null) {
			var emptyMainContentDiv = $(options.selector);
			var urlID = options.urlID;
			if (emptyMainContentDiv.length > 0 && $(data).find(".category.item_"+category+" li.item_" + urlID + " ul").length > 0) {
				var sitemap = $(data).find(".category.item_"+category+" li.item_" + urlID + " ul");
				var items = [];
				sitemap.children('li').each(function(e) {
					var a = $(this).children('a');
					items.push('<li class="'+options.itemClass+' '+options.itemClass+(e+1)+'"><a href="'+a.attr('href')+'">'+a.text()+'</a></li>');
				});
				emptyMainContentDiv.children().after("<div class='" + options.containerClass + "'><ul>" + items.join('') + "</ul></div>");
			}

		}
	},
	emptyMainContentNavigationExtended: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			containerClass: "ContentSubNav",
			selector: ".ObjectsCountNull",
			filePath: null,
			uppercase: false,
			fileExtension: "jpg"
		}, params);
		var category = navigation.getMainCategory();
		if (category !== null && options.filePath !== null) {
			var emptyMainContentDiv = $(options.selector);
			var urlID = options.urlID;

			if (emptyMainContentDiv.length > 0 && $(data).find(".category.item_" + category + " li.item_" + urlID + " ul").length > 0) {
				var items = [],
					sitemap = $(data).find(".category.item_" + category + " li.item_" + urlID + " ul");
				sitemap.children('li').each(function(i) {
					var href = $(this).children('a').attr('href'),
						title = $(this).children('a').text(),
						filename = href.split('/').pop().split('.')[0],
						itemClass = 'item';
					if (options.uppercase) {
						filename = filename.toUpperCase();
						itemClass = 'Item';
					}
					items.push("<li class='" + itemClass + " " + itemClass + (i + 1) + "'><a href='" + href + "'><img src='" + options.filePath + filename + "." + options.fileExtension + "' alt='"+title+"' /></a></li>");
				});
				emptyMainContentDiv.children().after("<div class='" + options.containerClass + "'><ul>" + items.join("") + "</ul></div>");
			}
		}
	}
};