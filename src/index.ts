import Experience from './app/experience'
import './style.css'

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement | null

if (!canvas) {
    throw new Error("Canvas not found")
}

const experience = new Experience(canvas)
