/**
 * @file
 * @author igor
 * @date  25.05.2015.
 */

"use strict"

var Hivemind_popup = new function () {
    var _this = this;
    var _theApp = null;
    var _bgPage = null;


    this.init = function () {
        var interval = setInterval(function () {
            if (typeof Hivemind !== "undefined") {
                _theApp = Hivemind;
                _bgPage = Hivemind.Background;
                _bgPage.popupPage = _this;
                clearInterval(interval);
            }
        }, 200);
        updateStyles();
    };

    /**
     * Called after user clicks toolbar button.
     */
    this.openPopup = function(){
        startScript();
    };

    var updateStyles = function () {
        if (navigator.platform == "MacIntel") {
            document.body.style.margin = "0 auto";
            document.body.style.width = "100%";
            document.body.style.minWidth = "250px";
        }
    };

    var startScript = function () {
        var url = _theApp.BrowserUtil.getCurrentTab();

        renderStatus('Searching Hivemind for ' + url);
        showResults("");
        updateHeight();

        getSiteDataFromHivemind(url, function(domain, result) {
            updateResults(result);
        }, function(errorMessage) {
            renderStatus(errorMessage);
        });
    };

    function updateResults (result) {
        renderStatus('');

        var html = " \
            <div class='summary'> \
                <a href='#' data-url='https://askhivemind.com/site/" + result.domain + "'><h2>" + result.domain + "</h2></a> \
            </div> \
            <h3>Technologies</h3> \
            <ul class='technologies'>";

        var c = result.technologies.length;
        for (var i = 0; i < c; i++) {
            var tech = result.technologies[i];
            html += " \
                    <li> \
                        <a class='tech-link' href='#' data-url='https://askhivemind.com/technology/" + tech.code + "'> \
                            <img class='favicon' src='chrome://hivemind/content/images/favicons/" + tech.code + "-favicon.ico' width='16' height='16' /> \
                        </a> \
                        <a class='tech-link' href='#' data-url='https://askhivemind.com/technology/" + tech.code + "'> \
                            <span class='label'>" + tech.label + "</label> \
                        </a> \
                    </li>";
        }

        if (result.asn && result.country) {
            html += "</ul> \
                <h3>Hosted by</h3> \
                <p><img class='flag' src='chrome://hivemind/content/images/flags/" + result.country + "_2x.png' width='16' height='16' />" + result.asn + "</p> \
            ";
        }

        showResults(html);
        setListeners();
        updateHeight();
    }

    function showResults (html) {
        var results = document.querySelector('.results');
        results.innerHTML = html;
    }

    function setListeners () {
        var links = document.querySelectorAll("a");
        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener("mouseup", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();

                var url = ev.currentTarget.getAttribute("data-url");
                if (url !== null) {
                    _bgPage.openNewTab(url);
                    _bgPage.hidePopup();
                }
            });
        });
    }

    function renderStatus(statusText) {
        document.querySelector('.status').textContent = statusText;
    }

    /**
     * @param {string} url - Url to search Hivemind for
     * @param {function(string,object)} callback - Called when site result has
     *   been found. The callback gets the domain and response object.
     * @param {function(string)} errorCallback - Called when the site is not found.
     *   The callback gets a string that describes the failure reason.
     */
    function getSiteDataFromHivemind(url, callback, errorCallback) {

        var domain = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
        var x = new XMLHttpRequest();

        try {
            x.open('GET', 'http://api.askhivemind.com/sites/' + domain);
            x.setRequestHeader("Authorization", "hivemind-chrome");
            x.responseType = 'json';

            x.onload = function() {

                if(x.response.error && x.response.error.message ) {
                    errorCallback(x.response.error.message);
                }

                if (!x.response || !x.response.data) {
                    errorCallback('No information found.');
                    return;
                }

                callback(url, x.response.data);
            };

            x.onerror = function() {
                errorCallback('Error retrieving information from Hivemind');
            };

            x.send(null);
        }
        catch (exception) {
            console.error("Exception in 'getSiteDataFromHivemind' (popup.js) :\n\t", exception);
        }
    }

    function updateHeight () {
        _bgPage.setPopupHeight(document.body.scrollHeight);
    }

};


window.onload = new function () {
    Hivemind_popup.init();
};