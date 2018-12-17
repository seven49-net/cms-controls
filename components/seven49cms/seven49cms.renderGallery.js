seven49cms.renderGallery = function(parameters) {
  var options = {
    bucket: seven49cms.helper.getBucketName(),
    path: null,
    thumbWidth: "180",
    thumbHeight: "0",
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
  var langExtension = function(arr) {

    var lang = seven49cms.helper.getLanguageString();
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


    //if (seven49cms.helper.awsSDKsupport()) {


      // format the path correctly
      if (options.path.indexOf('/') === 0) {
        options.path = options.path.substring(1);
      }
      if ((options.path.length - 1) !== options.path.lastIndexOf('/')) {
        options.path = options.path + "/";
      }
      // renderImages function
      var renderImages = function(pa) {

        var url = "https://s3-eu-west-1.amazonaws.com/" + pa.bucket + "?delimiter=%2F&encoding-type=url&marker=&max-keys=1000&prefix=" + encodeURI(pa.path);


        $.get(url, function(xml) {
          if ($(xml).find('Contents').length > 1) {
            var d = [];
            var objects = $(xml).find('Contents');
            // jquery shift() is not available
            objects.splice(0, 1);
            var allowed = /^jpg|jpeg|gif|png$/;
            $.each(objects, function(k, v) {
              //console.log(k);
              if ($(v).find("Key").length) {
                var key = $(v).find("Key").text();
                // console.log(key);
                var exten = key.split(".").pop().toLowerCase();
                if (key.lastIndexOf("__w_") === -1 && allowed.test(exten)) {
                  d.push(v);
                }
              }

            });

            if (d.length) {
              var items = [];
              var maxItemClass = (options.itemsPerRow) ? 'items-per-row' + options.itemsPerRow : 'items-per-row0';
              $.each(d, function(i, o) {
                var largeImgUrl = $(o).find("Key").text();
                var file = largeImgUrl.split(".");
                var fileExten = file.pop();
                var thumbUrl = file.join("") + "__w_" + pa.thumbWidth + "__h_" + pa.thumbHeight + "." + fileExten;
                var endOfRow = (i + 1) % pa.itemsPerRow === 0 ? ' ' + pa.endOfRowClass : '';
                var thumb = "<img class='thumb thumb" + (i + 1) + "' src='/" + thumbUrl + "' alt='' />";

                items.push('<' + pa.thumbContainerTag + ' class="gallery-image gallery-image' + (i + 1) + endOfRow + '"><a href="/' + largeImgUrl + '" data-lightbox="' + pa.container.substr(1) + '">' + thumb + '</a></' + pa.thumbContainerTag + '>');
                if (pa.limit > 0 && pa.limit === (i + 1)) {
                  return false;
                }
              });
              if (pa.wrapper) {
                items.unshift("<" + pa.wrapperTag + " class='" + pa.wrapperClass + "'>");
                items.push("</" + pa.wrapperTag + ">");
              }
              // console.log(items);
              // console.log(options.container);
              setTimeout(function() {
                $(pa.container).html(items.join(""));
              }, 100);
            }

          } else {

          }

        }).error(function(error) {
          $(pa.container).html("<div class='ajaxError'><span class='error'>" + error + "</span></div>");
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

      renderImages(options);

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
          label = options.albumTitle_it;
          break;
        case "en":
          break;
        default:
          label = options.albumTitle_en;

      }
      setTimeout(function() {
        lightbox.option({
          albumLabel: label
        });
      }, 1000);


    // } else {
    //   var errLang = langExtension(["de", "en"]);
    //   var errMsg = seven49cms.helper.messages.notSupported_en;
    //   if (errLang === "de") {
    //     errMsg = seven49cms.helper.messages.notSupported_de;
    //   }
    //   $(options.container).html("<div class='no-support'>" + errMsg + "</div>");
    // }
  }

};