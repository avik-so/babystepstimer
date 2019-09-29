export class BellPlayer {
    public static playBelAtTime(remainingTime: string, timeToPlay: string, sound: string) {
        if (remainingTime == timeToPlay) {
            this.playBell(sound);
        }
    }

    private static playBell(url: string): void {
        let audio = new Audio();
        audio.src = url;
        console.log(audio.src);
        audio.load();
        audio.play();
    }
}