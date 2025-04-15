import { EventEmitter } from "./eventEmitter"

export default class Sizes extends EventEmitter {
    public width: number
    public height: number
    public pixelRatio: number
    private container: HTMLElement

    constructor(containerSelector: string) {
        super()

        const container = document.querySelector(containerSelector) as HTMLElement
        if (!container) {
            throw new Error(`Container ${containerSelector} not found`)
        }
        this.container = container

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        //ANCHOR - Resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}