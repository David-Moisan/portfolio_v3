import Experience from "../app/experience"


export default class NukeOverlay {
    private container!: HTMLElement

    constructor(private experience: Experience) {
        this.container = this.createDOMStructure()
    }

    private createDOMStructure(): HTMLElement {
        const overlay = document.createElement("div")
        overlay.id = "glitch-overlay"
        overlay.className = "glitch-overlay"
        overlay.style.display = "none"

        overlay.innerHTML = `
            <div class="glitch" data-text="404 SYSTEM FAILURE">404 SYSTEM FAILURE</div>
            <div class="glow">404 SYSTEM FAILURE</div>
            <p class="subtitle">REBOOTING SEQUENCE</p>
            <div class="scanlines"></div>
        `

        document.body.appendChild(overlay)
        return overlay
    }
}