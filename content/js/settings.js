/**
 * @file
 * @author igor
 * @date  25.05.2015.
 */

"use strict"

if (typeof Hivemind === "undefined") {
    var Hivemind = {};
}

Hivemind.Settings = new function () {
    var _this = this;
    var _app = Hivemind;

    this.extensionName = "hivemind";
    this.extensionUrl = 'chrome://' + this.extensionName + '/';
    this.extensionResources = 'resource://' + this.extensionName + '/';

    this.prefsBranch =  "extensions." + this.extensionName + ".";
};