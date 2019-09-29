"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Configurations_1 = require("./Configurations");
class HTMLOutput {
    static CreateTimerHtml(timerText, bodyColor) {
        let timerHtml = this.createTimerBox(bodyColor);
        timerHtml += this.createTimerHtml(timerText);
        timerHtml += this.createMenuHTML(timerText !== Configurations_1.Configurations.getRemainingTimeCaption(0));
        timerHtml += this.createTimerBoxClosingTag();
        return timerHtml;
    }
    static createTimerBoxClosingTag() {
        return '</div>';
    }
    static createTimerBox(bodyColor) {
        return `<div style=\"border: 3px solid #555555; background: ${bodyColor}; margin: 0; padding: 0;\">`;
    }
    static createTimerHtml(timerText) {
        return "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText + "</h1>";
    }
    static createMenuHTML(isRunning) {
        let menuHTML = '<div style=\"text-align: center\">';
        menuHTML += isRunning ? this.createMenuLink('stop') + this.createMenuLink('reset') : this.createMenuLink('start');
        menuHTML += this.createMenuLink('quit');
        menuHTML += '</div>';
        return menuHTML;
    }
    static createMenuLink(command) {
        //Hiddent dependecy on Controller class
        const capitalizedCommand = command.charAt(0).toUpperCase() + command.substring(1);
        return `<a style=\"color: #555555;\" href=\"javascript:${command}();\">${capitalizedCommand}</a> `;
    }
}
exports.HTMLOutput = HTMLOutput;
//# sourceMappingURL=HTMLOutput.js.map