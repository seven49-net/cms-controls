///////////////////////
// navigation method contains all navigation cases found in typical seven49.net websites
// version 1.2
//////////////////////
var navigation = {
	extractLanguage: function(defaultLang){
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
	current: function(params){
		var options = $.extend({
			urlID: navigation.getUrlID(),
			currentClass: "selected",
			selector1: ".MainNavigation",
			selector2: ".MainNavigation"
		}, params);

		var selectedDropdownItem = $(options.selector1 + " ul li.item_" + options.urlID); // check if we are on a page available in the submenu of the main navigation
		$(options.selector1).find('.selected').removeClass("selected"); // reset main nav cat li on first level
		if (selectedDropdownItem.length === 0) {
			var regex = new RegExp("http://[^/?]+/[^/?]+/([^/?]+)");
			if (regex.test(location.href)) {
				var $mainCatName = regex.exec(location.href)[1];
				$(options.selector1 + " ul li.item_" + $mainCatName).addClass(options.currentClass);
			}
		}
		if (selectedDropdownItem.length > 0) {
			selectedDropdownItem.parentsUntil(options.selector2).addClass(options.currentClass); // mark main cat as selected
			selectedDropdownItem.addClass(options.currentClass); // mark current page li as selected
			selectedDropdownItem.children().addClass(options.currentClass); // mark current page anchor as selected
		}
	},
	mainNavigation: function(params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: ".MainNavigation",
			container2: ".root",
			defaultLanguage: "de",
			removeMainFirstEqualItem: true,
			rootClass: "root",
			onlyOneSubLevel: false,
			legacyHover: false,
			megaPanel: false,
			megaPanelClass: "MegaPanel",
			currentClass: "selected",
			subNavigation: false,
			subContainer: ".TreeNavigation",
			subClass: "sub-level",
			subShowRootParentLink: true,
			emptyMainContentNav: false,
			emptyContainerClass: "ContentSubNav",
			emptySelector: ".ObjectsCountNull",
			mobileMenu: false,
			mobileContainer: "#mobileMenu",
			mobileHideSubLevel: true,
			mobileCurrentClass: "selected",
			mobileCustomElements: false,
			mobilLanguageSelection: false,
			mobileLanguagePrepend: true,
			crumbs: false,
			crumbsContainer: ".breadcrumbs",
			languageNavigation: false,
			languageContainer: ".LanguageSelection",
			languageNoWrap: false
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
					selector1: options.container,
					selector2: options.container2,
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
						subClass: options.subClass,
						showRootParentLink: options.subShowRootParentLink
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
			showRootParentLink: true
		}, params);
		var urlID = options.urlID;
		// Tree Navigation

		var treeData = $(data);
		treeData.find('.selected').removeClass('selected');
		navigation.removeFirstPageEqualToCategory(treeData);

		var treeNavigation = null;
		// try to find the element
		if ($(treeData).find("li.item_" + urlID).not('.category').length) {
			// page has urlID but is not category (any level)
			treeNavigation = $(treeData).find("li.item_" + urlID).not('.category');
			//console.log('item_' + urlID);
		} else if ($(treeData).find("li.multichild.firstpage_" + urlID).length) {
			// first page has urlID and category is multichild - otherwise treeNavigation remains null
			treeNavigation = $(treeData).find("li.multichild.firstpage_" + urlID);
		}
		if (treeNavigation !== null) {

			treeNavigation.addClass(options.currentClass).parents().addClass(options.currentClass);

			var rootParent = $(treeData).find('li.category.'+options.currentClass)[0].outerHTML;

			$(options.container).append('<ul class="'+ options.rootClass +'">' + rootParent + '</ul>');
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
			selector1: options.container,
			selector2: options.container
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
			prependHome: false
		}, params);
		var crumbsData = $(data);

		// remove double element if link text is equal
		navigation.removeFirstPageEqualToCategory(crumbsData);

		var out = [];
		var prependHome;
		if (options.prependHome) {
			var home = $(crumbsData).find('li.category.item1');
			prependHome ="<li class='"+$(home).attr('class')+"'><a href='"+$(home).children('a').attr('href')+"'>" + $(home).children('a').text() + "</a></li>";
		}
		var crumbsCurrent = $(crumbsData).find('li.item_' + options.urlID);

		if (crumbsCurrent.length === 0) {
			if ($(crumbsData).find('li.firstpage_' + options.urlID).length) {
				crumbsCurrent = $(crumbsData).find('li.firstpage_' + options.urlID);
			} else {
			crumbsCurrent = null;
			}
		}


		var levels = 0;
		if (crumbsCurrent !== null && crumbsCurrent.length) {

			out.push("<li class='current item_" + options.urlID +"'>" + crumbsCurrent.children('a').text() + "</li>");
			while(crumbsCurrent.parent().length !== 0) {
				crumbsCurrent = crumbsCurrent.parent();
				levels += 1;
				if (levels % 2 === 0) {
					var classes = crumbsCurrent.attr('class'),
					href = crumbsCurrent.children().attr('href'),
					text = crumbsCurrent.children('a').text();
					out.unshift("<li class='"+classes+"'><a href='"+href+"'>" + text + "</a></li>");
				}
			}

		}
		if (options.prependHome) {
			out.unshift(prependHome);
		}
		if (out.length > 1 && options.prependHome === false || options.prependHome === true) {
			out.unshift('<ul>');
			out.push('</ul>');
		} else {
			out = [];
		}
		$(options.container).append(out.join(""));

	},
	languageNavigation: function(data, params) {
		var options = $.extend({
			urlID: navigation.getUrlID(),
			container: ".LanguageSelection",
			currentClass: "selected",
			noWrap: false,
			prepend: false
		}, params);
		var urlID = options.urlID;
		var currentLang = navigation.extractLanguage();
		var $container = $(options.container);
		var currentCat = $(data).find('li.item1.category');

		if ($(data).find('li.item_' +urlID).not('.category').length) {
			currentCat = $(data).find('li.item_' + urlID).parents('.category');
		} else if ($(data).find('li.firstpage_' +urlID).length) {
			currentCat = $(data).find('li.firstpage_' +urlID);
		}

		$.getJSON( "/sitemap/languages.json", function(jLang) {
			var out = [];

			for (var i=0; i<jLang.length; i++) {
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
			selector: ".ObjectsCountNull"
		},params);
		var emptyMainContentDiv = $(options.selector);
		var urlID = options.urlID;
		if (emptyMainContentDiv.length > 0 &&  $(data).find("ul li.item_" + urlID + " ul").length > 0) {
			emptyMainContentDiv.children().after("<div class='" + options.containerClass + "'><ul>" + $(data).find("ul li.item_" + urlID + " ul").html() + "</ul></div>");
		}
	}
};