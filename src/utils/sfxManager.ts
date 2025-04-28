import AudioManager from "./audioManager"

export default class SFXManager {
    private static readonly BASE_PATH = "/sounds/sfx/"
    private static readonly DEFAULT_VOLUME = 0.2

    private static typeSounds = ["keyboard-sound-1.wav", "keyboard-sound-2.wav", "keyboard-sound-3.wav"]
    private static enterSounds = ["enter-btn-1.wav", "enter-button-2.wav", "enter-button-3.wav"]

    private static playRandom(sounds: string[]) {
        const random = sounds[Math.floor(Math.random() * sounds.length)]
        const audio = new Audio(`${this.BASE_PATH}${random}`)

        audio.volume = this.DEFAULT_VOLUME + Math.random() * 0.1 - 0.05
        audio.play().catch(err => {
            console.warn("SFX playback failed", err)
        })
    }

    static playScanSound() {
        const audio = new Audio(`${this.BASE_PATH}sci-fi-sound.mp3`)
        audio.volume = this.DEFAULT_VOLUME
        audio.play().catch(err => {
            console.warn("SFX scan failed", err)
        })
    }

    static playNukeSound() {
        AudioManager.stopBackgroundMusic()
        const audio = new Audio(`${this.BASE_PATH}uk_nuke_alarm.mp3`)
        audio.volume = 0.1
        audio.play().catch(err => {
            console.warn("SFX nuke failed", err)
        })
    }

    static playBootAfterNukeSound() {
        const audio = new Audio(`${this.BASE_PATH}boot.mp3`)
        audio.volume = 0.1
        audio.play().catch(err => {
            console.warn("SFX nuke failed", err)
        })

        setTimeout(() => {
            AudioManager.playBackgroundMusic()
        }, 400)
    }

    static playZoomCameraSound() {
        const audio = new Audio(`${this.BASE_PATH}zoom_camera.wav`)
        audio.volume = 0.1
        audio.play().catch(err => {
            console.warn("SFX zoom camera failed", err)
        })
    }

    static playDataSound() {
        const audio = new Audio(`${this.BASE_PATH}data_calculation_min.wav`)
        audio.volume = 0.1
        audio.play().catch(err => {
            console.warn("SFX Data Calculation failed", err)
        })
    }

    static playTypeSound() {
        this.playRandom(this.typeSounds)
    }

    static playEnterSound() {
        this.playRandom(this.enterSounds)
    }
}