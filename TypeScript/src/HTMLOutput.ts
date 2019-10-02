import { Configurations } from './Configurations';

export class HTMLOutput {
    static CreateTimerHtml(timerText: string, bodyColor: string): string {
        let timerHtml: string = this.createTimerBox(bodyColor);
        timerHtml += this.createTimerHtml(timerText);
        timerHtml += this.createMenuHTML(timerText !== Configurations.getRemainingTimeCaption(0));
        timerHtml += this.createTimerBoxClosingTag();
        return timerHtml;
    }
    private static createTimerBoxClosingTag(): string {
        return '</div>';
    }
    private static createTimerBox(bodyColor: string): string {
        return `<div style=\"border: 3px solid #555555; background: ${bodyColor}; margin: 0; padding: 0;\">`;
    }
    private static createTimerHtml(timerText: string): string {
        return "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText + "</h1>";
    }
    private static createMenuHTML(isRunning: boolean): string {
        let menuHTML = '<div style=\"text-align: center\">';
        menuHTML += isRunning ? this.createMenuLink('stop') + this.createMenuLink('reset') : this.createMenuLink('start');
        menuHTML += this.createMenuLink('quit');
        menuHTML += '</div>';
        return menuHTML;
    }
    
    private static createMenuLink(command: string): string {
        const capitalizedCommand = command.charAt(0).toUpperCase() + command.substring(1);
        return `<a style=\"color: #555555;\" href=\"javascript:${command}();\">${capitalizedCommand}</a> `;
    }
}
