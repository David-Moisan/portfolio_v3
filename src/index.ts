import Experience from './app/experience'
import './style.css'
import '../gsap-config'

const showLoaderDuration = 3000

const loadingScreen = document.querySelector('.loading_screen') as HTMLElement
const terminalScreen = document.querySelector('.terminal_container') as HTMLElement
const mapScreen = document.getElementById("map_container") as HTMLElement
const profileScreen = document.getElementById("profile_container") as HTMLElement

const terminal = document.getElementById('terminal') as HTMLElement
const inputField = document.getElementById('input') as HTMLInputElement

const initAppUI = () => {
    terminalScreen.style.display = 'none'
    mapScreen.style.display = 'none'
    profileScreen.style.display = 'none'

    loadingScreen.style.display = 'flex'
    loadingScreen.style.opacity = '1'
    loadingScreen.style.zIndex = '1000'
}

const hideLoaderAndStartExperience = () => {
    loadingScreen.style.opacity = '0'
    loadingScreen.style.transition = 'opacity 0.5s ease'
    
    setTimeout(() => {
        loadingScreen.style.display = 'none'
        terminalScreen.style.display = 'block'

        const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement
        if (!canvas) throw new Error("Canvas not found")

        new Experience(canvas)
    }, 500)
}

window.addEventListener("DOMContentLoaded", () => {
    initAppUI()

    setTimeout(() => {
        hideLoaderAndStartExperience()
    }, showLoaderDuration)
})
