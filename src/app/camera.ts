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
            console.log('Hey')
        })
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.experience.sizes.width / this.experience.sizes.height, 
            0.1, 
            100
        )
        this.instance.position.set(1, 1, 1)
        this.experience.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.experience.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.experience.sizes.width / this.experience.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}