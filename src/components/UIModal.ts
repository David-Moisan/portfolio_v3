import { TargetModalData } from "@/types/targetProjectType"
import gsap from "gsap"

export default class UIModal {
    public domElement!: HTMLDivElement
    public isVisible: boolean = false
    public currentData: any = null

    constructor() {
        this.domElement = document.createElement('div')
        this.domElement.className = 'ui-modal'
        this.initDOM()
        document.body.appendChild(this.domElement)
        this.setupEventListeners()
    }

    private initDOM() {
        this.domElement.innerHTML = `
            <div class="modal-content">
                <button id="modal-close" class="modal-close">✕</button>
                <h3 class="modal-title"></h3>
                <p class="modal-description"></p>
                <div class="modal-date"></div>
                <a href="#" target="_blank" class="modal-link" style="display: none;">Open →</a>
            </div>
        `
    }

    private setupEventListeners() {
        this.domElement.querySelector('#modal-close')?.addEventListener('click', (e) => {
            e.preventDefault()
            this.hide()
        })

        this.domElement.querySelector('.modal-content')?.addEventListener('click', (e) => {
            e.stopPropagation()
        })
    }

    show(data: TargetModalData) {
        this.currentData = data

        const titleEl = this.domElement.querySelector('.modal-title') as HTMLElement;
        const descEl = this.domElement.querySelector('.modal-description') as HTMLElement;
        const dateEl = this.domElement.querySelector('.modal-date') as HTMLElement;
        const linkEl = this.domElement.querySelector('.modal-link') as HTMLAnchorElement;

        titleEl.textContent = data.title;
        descEl.textContent = data.description;
        dateEl.textContent = data.date;

        if (data.link) {
            linkEl.style.display = 'inline-block'
            linkEl.href = data.link
        } else {
            linkEl.style.display = 'none'
        }

        gsap.timeline()
            .set(this.domElement, { display: 'block' })
            .fromTo(this.domElement, 
                { opacity: 0, y: 20}, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "back.out(1.2)"
                }
            )
            .from(this.domElement.querySelectorAll('*'), {
                opacity: 0,
                y: 10,
                stagger: 0.05,
                duration: 0.2
            }, 0.1)

        this.isVisible = true
    }

    hide() {
        gsap.timeline()
        .to(this.domElement.querySelectorAll('*'), {
            opacity: 0,
            y: -10,
            stagger: 0.02,
            duration: 0.1
        })
        .to(this.domElement, {
            opacity: 0,
            y: 20,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                this.domElement.style.display = 'none';
                this.currentData = null;
            }
        })
        this.isVisible = false
    }

    toggle() {
        if (this.isVisible) {
            this.hide()
        } else if (this.currentData) {
            this.show(this.currentData)
        }
    }
}