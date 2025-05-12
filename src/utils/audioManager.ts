export default class AudioManager {
    private static backgroundTracks: string[] = [
        "/sounds/background_song_2_compressed.mp3",
        "/sounds/background_song_1_compressed.mp3"
    ]
    private static currentTrackIndex = 0
    private static currentAudio: HTMLAudioElement | null = null

    static playBackgroundMusic() {
        this.stopBackgroundMusic()

        const audio = new Audio(this.backgroundTracks[this.currentTrackIndex])
        audio.loop = true
        audio.volume = 0.2
        audio.play().catch(err => {
            console.warn("Background audio failed", err)
        })
        this.currentAudio = audio
    }

    static stopBackgroundMusic() {
        if (this.currentAudio) {
            this.currentAudio.pause()
            this.currentAudio.currentTime = 0
            this.currentAudio = null
        }
    }

    static nextBackgroundMusic() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundTracks.length
        this.playBackgroundMusic()
    }
}