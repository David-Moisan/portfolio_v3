import Experience from "./experience";
import * as THREE from 'three';

export default class Renderer {

    public instance!: THREE.WebGLRenderer

    constructor(public experience: Experience) {
        this.experience = experience

        this.setInstance()

    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.experience.canvas,
            antialias: true
        })

        this.instance.setSize(
            this.experience.sizes.width,
            this.experience.sizes.height,
        )

        this.instance.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
        this.instance.setClearColor(0x000, 1)
    }

    resize() {
        this.instance.setSize(
            this.experience.sizes.width,
            this.experience.sizes.height,
        )

        this.instance.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
    }

    update() {
        this.instance.render(this.experience.scene, this.experience.camera.instance)
    }
}