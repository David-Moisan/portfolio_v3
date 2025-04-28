import { TargetModalData } from "@/types/targetProjectType"
import SFXManager from "../utils/sfxManager"

export default class UIModal {
    public domElement!: HTMLDivElement
    public isVisible: boolean = false
    public currentData: any = null

    constructor() {
        this.domElement = document.createElement('div')
        this.domElement.className = 'ui-modal'
        this.initDOM()
        this.setupEventListeners()
        document.body.appendChild(this.domElement)
    }

    private initDOM() {
        this.domElement.innerHTML = `
            <div class="modal-header">
                <div class="modal-header-title">
                    <span class="modal-title-point"></span>
                    <h3 class="modal-title"></h3>
                </div>
                <button id="modal-close" class="modal-close">✕</button>
            </div>
            <div class="modal-content">
                <div class="modal-date" style="--i: 1;"></div>
                <p class="modal-description" style="--i: 2;"></p>
            </div>
            <div class="modal-footer">
                <a href="#" target="_blank" class="modal-link" style="display: none;">Open →</a>
            </div>
        `
    }

    private setupEventListeners() {

        setTimeout(() => {
            const closeButton = this.domElement.querySelector('#modal-close')
            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.preventDefault()
                    this.hide()
                })
            } else {
                console.error('Close button not found in modal')
            }
        }, 10)

        this.domElement.querySelector('.modal')?.addEventListener('click', (e) => {
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

        this.domElement.style.display = 'block'
        requestAnimationFrame(() => {
            SFXManager.playDataSound()
            this.domElement.classList.add('visible')
        })

        this.isVisible = true;
    }

    hide() {
        this.domElement.classList.remove('visible')

        const transitionDuration = 300

        setTimeout(() => {
            this.domElement.style.display = 'none'
            
        }, transitionDuration)

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