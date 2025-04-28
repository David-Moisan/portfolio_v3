import Experience from './app/experience'
import './style.css'
import '../gsap-config'

const showLoaderDuration = 3000

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
            if (loader) {
                loader.style.opacity = '0'
                setTimeout(() => loader.style.display = 'none', 500)
            }
    
            const terminal = document.querySelector('.terminal_container') as HTMLElement
            if (terminal) {
                terminal.style.display = 'block'
            }
        }, remainingTime)
    })
})