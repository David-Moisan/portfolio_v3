import Experience from '@/app/experience';
import { COLORS, CURSORS, OPACITIES } from '../types/style';
import * as THREE from 'three';
import { EventEmitter } from './eventEmitter';

export default class Raycaster extends EventEmitter {
    private raycaster!: THREE.Raycaster
    private mouse!: THREE.Vector2
    private camera!: THREE.Camera
    private hoveredObject: THREE.Object3D | null = null
    private clickedObject: THREE.Object3D | null = null
    private objectsToTest: THREE.Object3D[] = []

    constructor(public experience: Experience) {
        super()
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.camera = this.experience.camera.instance

        window.addEventListener("mousemove", (event) => this.onMouseMove(event))
        window.addEventListener("click", (event) => this.onMouseClick(event))
    }

    public addObjects(objects: THREE.Object3D[]) {
        this.objectsToTest = objects
    }

    private onMouseClick(event: MouseEvent) {
        this.mouse.x = (event.clientX / this.experience.sizes.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.experience.sizes.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest)

        if (intersects.length > 0) {
            const object = intersects[0].object
            this.trigger('click', [object])
        }
    }

    private onMouseMove(event: MouseEvent) {
        this.mouse.x = (event.clientX / this.experience.sizes.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.experience.sizes.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest)

        if (intersects.length > 0) {
            const object = intersects[0].object

            if (object !== this.hoveredObject) {
                if (this.hoveredObject) this.onMouseLeave(this.hoveredObject)
                this.onMouseEnter(object)
                this.hoveredObject = object
            }
        } else if (this.hoveredObject) {
            this.onMouseLeave(this.hoveredObject)
            this.hoveredObject = null
        }
    }

    private onMouseEnter(object: THREE.Object3D) {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) {
            object.material.color.set(COLORS.hover)
            object.material.opacity = OPACITIES.hover
        }

        document.body.style.cursor = CURSORS.POINTER
    }

    private onMouseLeave(object: THREE.Object3D) {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) {
            object.material.color.set(COLORS.primary)
            object.material.opacity = OPACITIES.default
        }

        document.body.style.cursor = CURSORS.DEFAULT
    }
}
