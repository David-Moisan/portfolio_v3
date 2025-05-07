import { loaderSection } from "../types/dom";
import Experience from "../app/experience";
import { DOMStyle } from "../types/style";

export default class Loader {
    private container!: HTMLElement
    constructor(public experience: Experience) {
        this.container = this.createDOMStructure()
        document.body.appendChild(this.container)
    }

    private createDOMStructure(): HTMLElement {
        const section = document.createElement("section")
        section.classList.add("loading_screen")
        section.innerHTML = loaderSection
        section.style.display = DOMStyle.flex
        section.style.opacity = DOMStyle.visibleOpacity
        section.style.zIndex = DOMStyle.z1000
        return section
    }
}