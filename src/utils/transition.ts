import gsap from "gsap"
import { transitionLoaderToTerminal } from "../types/dom"

export default class HolographicTransition {
    public element: HTMLElement

    constructor() {
        this.element = document.createElement('div')
        this.element.className = 'holo_transition'
        this.element.innerHTML = transitionLoaderToTerminal
        document.body.appendChild(this.element)
        this.element.style.opacity = '0'
    }

    play(callback: () => void) {
        const distortion = this.element.querySelector('.holo_distortion') as HTMLElement
        const ring = this.element.querySelector('.holo_ring') as HTMLElement
        const sweep = this.element.querySelector('.holo_sweep') as HTMLElement

        this.element.style.display = 'block'

        const tl = gsap.timeline({
            onComplete: () => {
                this.element.style.display = 'none'
                callback()
            }
        })

        tl.to(this.element, { opacity: 1, duration: 0.1 })
            .fromTo(distortion, { scale: 1.3, opacity: 0.8 }, { scale: 0.9, opacity: 0, duration: 0.3, ease: "power3.inOut" }, 0)
            .fromTo(ring, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "expo.out" }, 0.1)
            .to(ring, { opacity: 0, scale: 1.2, duration: 0.3, ease: "power3.in" }, 0.5)
            .fromTo(sweep, { y: "-100%" }, { y: "100%", duration: 0.5, ease: "power2.inOut" }, 0.2)
            .to(this.element, { opacity: 0, duration: 0.2 }, 0.7)
    }
}