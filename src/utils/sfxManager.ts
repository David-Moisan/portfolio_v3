export default class SFXManager {
    private static basePath = "/sounds/sfx/"
    private static volume = 0.2

    private static typeSounds = ["keyboard-sound-1.wav", "keyboard-sound-2.wav", "keyboard-sound-3.wav"]
    private static enterSounds = ["enter-btn-1.wav", "enter-button-2.wav", "enter-button-3.wav"]

    private static playRandom(sounds: string[]) {
        const random = sounds[Math.floor(Math.random() * sounds.length)]
        const audio = new Audio(`${this.basePath}${random}`)

        audio.volume = this.volume + Math.random() * 0.1 - 0.05
        audio.play().catch(err => {
            console.warn("SFX playback failed", err)
        })
    }

    static playNukeSound() {
        const audio = new Audio(`${this.basePath}uk_nuke_alarm.mp3`)
        audio.volume = 0.1
        audio.play().catch(err => {
            console.warn("SFX nuke failed", err)
        })
    }

    static playBootAfterNukeSound() {
        const audio = new Audio(`${this.basePath}boot.mp3`)
        audio.volume = 0.1
        audio.play().catch(err => {
            console.warn("SFX nuke failed", err)
        })
    }

    static playTypeSound() {
        this.playRandom(this.typeSounds)
    }

    static playEnterSound() {
        this.playRandom(this.enterSounds)
    }
}