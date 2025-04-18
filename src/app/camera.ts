import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons'
import Experience from "./experience";

export default class Camera {
    public instance!: THREE.PerspectiveCamera
    public controls!: OrbitControls

    constructor(public experience: Experience) {
        this.experience = experience
        this.setInstance()
        this.setOrbitControls()

        this.experience.sizes.on('resize', () => {
            this.resize()
        })
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            45, 
            this.experience.sizes.width / this.experience.sizes.height, 
            0.1, 
            100
        )
        this.instance.position.set(0, 1, -2.08)
        this.experience.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.experience.canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.minDistance = 1 
        this.controls.maxDistance = 100
        this.controls.maxPolarAngle = Math.PI / 2.75

        setTimeout(() => {
            this.experience.canvas.focus()
        }, 100)
    }

    enableControls(enabled: boolean) {
        this.controls.enabled = enabled
    }

    resize() {
        this.instance.aspect = this.experience.sizes.width / this.experience.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}