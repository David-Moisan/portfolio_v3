import Experience from './app/experience'
import './style.css'
import '../gsap-config'
import Warning from './utils/warning'

const showLoaderDuration = 3000

Warning.checkIfMobile()

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement
    if (!canvas) throw new Error("Canvas not found")

    const experience = new Experience(canvas)
    const startTime = Date.now()

    experience.resources.on('ready', () => {
        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, showLoaderDuration - elapsed)

        setTimeout(() => {
            const loader = document.querySelector('.loading_screen') as HTMLElement
            if (!loader) return

            loader.style.transition = 'opacity 0.4s ease'
            loader.style.opacity = '0'

            setTimeout(() => {
                loader.style.display = 'none'

                experience.world.startAfterLoader()
            }, 400)
        }, remainingTime)
    })
})