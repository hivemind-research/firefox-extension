/**
 * @file
 * @author igor
 * @date  25.05.2015.
 */

"use strict"

if (typeof Hivemind === "undefined") {
    var Hivemind = {};
}

Hivemind.Background = new function () {
    var _this = this;
    var _app = Hivemind;
    var browser_util = _app.BrowserUtil;

    this.popupPage = null;

    this.init = function () {
        window.removeEventListener("load", _this.init, false);

        handleToolbarButton();

        var popup_ifr = document.getElementById("popup_ifr");
        popup_ifr.contentWindow.Hivemind = _app;
    };

    var handleToolbarButton = function () {
        var hivemindButton = document.getElementById("hivemindButton");
        hivemindButton.onclick = _this.openPopup;
    };

    this.openPopup = function () {
        var panel = document.getElementById('hivemindPanel');
        var button = document.getElementById('hivemindButton');
        panel.openPopup(button, 'after_end', 5, 2, false, false);

        if (_this.popupPage) {
            _this.popupPage.openPopup();
        }
    };

    this.hidePopup = function () {
        var panel = document.getElementById('hivemindPanel');
        panel.hidePopup();
    };

    this.openNewTab = function (url) {
        browser_util.addTab(url, true);
    };

    this.setPopupHeight = function (height) {
        var panel = document.getElementById('hivemindPanel');
        var popup_ifr = document.getElementById('popup_ifr');

        if (height < 80) height = 80;
        if (height > 600) height = 600;

        panel.style.height = parseInt(height) + 10 + "px";
        popup_ifr.style.height = parseInt(height) + 10 + "px";
    };


    window.addEventListener("load", _this.init, false);
};