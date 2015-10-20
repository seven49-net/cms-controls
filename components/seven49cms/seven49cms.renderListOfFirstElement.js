seven49cms.renderListOfFirstElement = function(pathToParent, params) {
	var options = $.extend({
		container: ".subContentListing",
		jQuerySelectors: "h1.ContentTitle",
		characters: 200,
		containerSelector: "",
		itemTag: "li",
		headline: "h1.ContentTitle",
		listImageClass: "listImage",
		textContainer: ".ImageText",
		listClass: "customListing",
		listItemClass: "listItem",
		linkHeadline: true,
		headTag: "h2",
		moreLink: false,
		moreLinkText: "Weiter lesen",
		moreLinkClass: "more",
		moreLinkContainerTag: "p",
		delimiter: " ... ",
		errorMessage: "no content available",
		hasImgClass: "hasImage",
		listDescriptionClass: "Description",
		limit: 0
	}, params);
	var pageUrl = (pathToParent === undefined) ? null : pathToParent,
		pageId = pathToParent.split("/").pop().split(".")[0],
		lang = pageUrl.substr(1, 2);
		if (pageUrl ===null) {
			$(options.container).html('<b>Bitte Pfad eingeben ("/de/meine-eltern/seit.htm")</b>');
		} else {
			$.get("/sitemap/" + lang + ".htm", function(data) {
				$(options.container).append("<" + options.itemTag + " class='loader'>" + seven49cms.loader + "</"+options.itemTag+">");

				var parent = $(data).find('li.item_' + pageId).html();
				var childrenList = [];
				// get all children's urls
				$(parent).find('li a').each(function() {
					childrenList.push($(this).attr('href'));
				});

				var results=[],
					total = childrenList.length,
					$content = $(options.container);

				for (var i = 0; i < total; i++) {
					seven49cms.helper.getAndWriteContent({
						childUrl: childrenList[i],
						queries: options.jQuerySelectors,
						element: $content,
						headline: options.headline,
						linkHeadline: options.linkHeadline,
						itemTag: options.itemTag,
						headlineTag: options.headTag,
						characters: options.characters,
						delimiter: options.delimiter,
						errorMessage: options.errorMessage,
						listDescriptionClass: options.listDescriptionClass,
						moreLink: options.moreLink,
						linkText: options.moreLinkText,
						linkTag: options.moreLinkContainerTag,
						linkClass: options.moreLinkClass,
						ajaxLoader: ".loader",
						counter: i,
						total: total
					},results);
					if (options.limit > 0 && (i+1) === options.limit) {
						break;
					}
				}
			});
		}


};
