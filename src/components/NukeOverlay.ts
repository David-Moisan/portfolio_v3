import { overlay404 } from "../types/dom"
import Experience from "../app/experience"
import { DOMStyle } from "../types/style"

export default class NukeOverlay {
    private container!: HTMLElement

    constructor(private experience: Experience) {
        this.container = this.createDOMStructure()
    }

    private createDOMStructure(): HTMLElement {
        const overlay = document.createElement("div")
        overlay.id = "glitch-overlay"
        overlay.className = "glitch-overlay"
        overlay.style.display = DOMStyle.displayNone
        overlay.innerHTML = overlay404
        document.body.appendChild(overlay)
        return overlay
    }
}