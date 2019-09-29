"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BellPlayer {
    static playBelAtTime(remainingTime, timeToPlay, sound) {
        if (remainingTime == timeToPlay) {
            this.playBell(sound);
        }
    }
    static playBell(url) {
        let audio = new Audio();
        audio.src = url;
        console.log(audio.src);
        audio.load();
        audio.play();
    }
}
exports.BellPlayer = BellPlayer;
//# sourceMappingURL=BellPlayer.js.map