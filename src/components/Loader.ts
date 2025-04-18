import Experience from "../app/experience";

export default class Loader {
    private container!: HTMLElement
    constructor(public experience: Experience) {
        this.container = this.createDOMStructure()
        document.body.appendChild(this.container)
    }

    private createDOMStructure(): HTMLElement {

        const section = document.createElement("section")
        section.classList.add("loading_screen")

        section.innerHTML = `
            <header>
                <h1 class="loading_screen__title">
                    PORTFOLIO 
                    <span class="loading_screen__title--detail">// V3</span>
                </h1>
                <p class="loading_screen__subtitle">LOADING</p>
            </header>
            <div>
                <p>PRODUCED BY // PHI&CODE</p>
            </div>
        `

        section.style.display = "flex"
        section.style.opacity = '1'
        section.style.zIndex = '1000'
        return section
    }
}