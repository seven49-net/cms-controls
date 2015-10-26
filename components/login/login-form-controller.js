$(document).ready(function () {

    var apiHost = "http://cmsapi.seven49.net";
    //var apiHost = "http://localhost.cmsadmin.seven49.net";
        
    docCookies.removeItem("SessionGuid","/"); // log out 

    $(".Login .Button").click(function () {

        var redirectUrl = getQueryStringParameterByName("redirecturl");
        var origin = window.location.href;
        if (origin.indexOf("?") > 0) {
            origin = origin.substring(0, origin.indexOf("?"));
        }
        var url = apiHost + "/Login?username=" + encodeURIComponent($('#LoginUserName').val()) + "&password=" + encodeURIComponent($('#LoginPassword').val()) + "&redirecturl=" + encodeURIComponent(redirectUrl) + "&sessionguid=" + docCookies.getItem("SessionGuid") + "&origin=" + encodeURIComponent(origin);
        console.log(url);
        console.log("Cookie: " + document.cookie);

        $.ajax({
            dataType: "json",
            url: url,
            async: true
        }).done(function (data) {
            console.log(data);
            docCookies.setItem("SessionGuid", data.SessionGuid, 7776000, "/"); // 24 hours = 86400 seconds, 90 days = 7776000 seconds 
            console.log("Cookie: " + document.cookie);
            if (data.RedirectUrl == "") {
                window.location = "/";               
            }
            else {                
                window.location = data.RedirectUrl;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("error getting " + url);
            var jsonResponse = $.parseJSON(jqXHR.responseText);
            var message;
            if (jsonResponse.Message) {
                console.log("Error message: " + jsonResponse.Message);
                message = jsonResponse.Message;
            }
            else {
                message = "Login failed";
            }
            insertSystemMessageAfter(".Login .Button", message, "loginSystemMessage");
        });
    });

    $('.PasswordRecovery .Button').click(function () {

        var username = $('#PasswordRecoveryUsername').val();
        if (!username) {
            console.log('Username is missing');
            return;
        }
        var origin = window.location.href;
        if (origin.indexOf("?") > 0) {
            origin = origin.substring(0, origin.indexOf("?"));
        }
        console.log('Recovering password for ' + username);
        var url = apiHost + "/LostPassword/?username=" + username + "&origin=" + origin

        console.log(url);
        $.getJSON(url, function (data) {
            console.log(data);
            insertSystemMessageAfter(".PasswordRecovery .Button", data.Message, "passwordRecoverySystemMessage");
            $('#LoginUserName').val(username);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("error getting " + url);
            var jsonResponse = $.parseJSON(jqXHR.responseText);
            var message;
            if (jsonResponse.Message) {
                console.log("Error message: " + jsonResponse.Message);
                message = jsonResponse.Message;
            }
            else {
                message = "Password recovery failed";
            }
            insertSystemMessageAfter(".PasswordRecovery .Button", message, "passwordRecoverySystemMessage");
        });
    });

    function getQueryStringParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function insertSystemMessageAfter(selector, message, id) {
        $("#" + id).remove();
        $("<div id=\"" + id + "\" class=\"system-messages\">" + message + "</div>").insertAfter(selector);
    }

});