/**
 * @file
 * @author igor
 * @date  25.05.2015.
 */

"use strict"

if (typeof Hivemind === "undefined") {
    var Hivemind = {};
}

Hivemind.BrowserUtil = new function () {
    var _this = this;
    var _app = Hivemind;


    var IO = Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    var cookieSvc = Components.classes["@mozilla.org/cookieService;1"]
        .getService(Components.interfaces.nsICookieService);

    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefService);


    //isFocused - bool. true - new tab will be focused; false - will not
    this.addTab = function(url, isFocused) {
        var tab = gBrowser.addTab(url);
        if (tab && isFocused) gBrowser.selectedTab = tab;
    };

    //get data from a local storage
    //strBranch - a branch to get data : "extentions.your_ext_abbreviation."
    //strLocalName - name of local varriable
    //return : value of strLocalName
    this.getLocalVar = function(strBranch, strLocalName) {
        var value = null;
        try {
            var branch = prefs.getBranch(strBranch);
            value = branch.getCharPref(strLocalName);
        } catch (e) {
        }
        return value;
    };

    //set data to a local storage
    //strBranch - a branch where the data will be set : "extentions.your_ext_abbreviation."
    //strLocalName - name of local varriable
    //localValue - a data to set
    //return : BOOL
    this.setLocalVar = function(strBranch, strLocalName, localValue) {
        var branch = null;
        try {
            var branch = prefs.getBranch(strBranch);
            if (branch)
                branch.setCharPref(strLocalName, localValue);
        } catch(e) {
            return false;
        }
        return true;
    };


    this.getCurrentTab = function() {
        return gBrowser.selectedBrowser.contentWindow.location.href;
    };

    this.getCurrentTabHtml = function () {
        return gBrowser.selectedBrowser.contentWindow.document.documentElement.innerHTML;
    };

};