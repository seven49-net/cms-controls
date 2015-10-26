$(document).ready(function () {

    var redirectUrl = getQueryStringParameterByName("redirecturl");
    var sessionGuid = docCookies.getItem("SessionGuid");
    console.log("sessionGuid: " + sessionGuid);
    if (sessionGuid) {

        var origin = window.location.href;
        if (origin.indexOf("?") > 0) {
            origin = origin.substring(0, origin.indexOf("?"));
        }
        var url = "http://cmsapi.seven49.net/LoginCheck?redirecturl=" + redirectUrl + "&sessionguid=" + sessionGuid + "&origin=" + encodeURIComponent(origin);
        // var url = "http://localhost.cmsadmin.seven49.net/LoginCheck?redirecturl=" + redirectUrl + "&sessionguid=" + sessionGuid + "&origin=" + encodeURIComponent(origin);
        console.log(url);

        $.getJSON(url, function (data) {
            console.log(data);
            console.log("Cookie: " + document.cookie);
            if (!data.RedirectUrl) {
                console.log(data.Message);
                console.log('no redirect url available');
                console.log('we now redirect to login page');
                //alert('no redirect url available: we now redirect to login page');
                window.location = "login.htm?redirecturl=" + redirectUrl;
            }
            else {
                console.log('redirecting to guid url')
                window.location = data.RedirectUrl;
            }
        }).fail(function () {
            console.log("error getting " + url);
            //alert("error getting " + url);
            window.location = "login.htm?redirecturl=" + redirectUrl;
        });
    }
    else {
        console.log('no sessionGuid available');
        console.log('we now redirect to login page');
        //alert('no sessionGuid: we now redirect to login page');
        window.location = "login.htm?redirecturl=" + redirectUrl;
    }

});

function getQueryStringParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}