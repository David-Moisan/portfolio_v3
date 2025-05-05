import * as THREE from 'three';
import Experience from "./experience";
import { COLORS } from "../types/style";

export default class Renderer {

    public instance!: THREE.WebGLRenderer

    constructor(public experience: Experience) {
        this.experience = experience

        this.setInstance()

    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.experience.canvas,
            antialias: true,
        })

        this.instance.setSize(
            this.experience.sizes.width,
            this.experience.sizes.height,
        )

        this.instance.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
        this.instance.setClearColor(COLORS.background, 1)
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.6
        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.autoClear = false
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