import * as THREE from 'three';
import GUI from "lil-gui";
import Experience from "@/app/experience";
import { TargetProjectPositionParams } from '@/types/targetProjectType';
import { BASIC_ROTATION } from '../types/transformation';
import Raycaster from '../utils/raycaster';
import { COLORS, OPACITIES } from '../types/style';

export default class TargetProject {
    public debugFolder!: GUI
    public geometry!: THREE.CircleGeometry
    public positions!: TargetProjectPositionParams[]
    public meshes: THREE.Mesh[] = []
    private raycaster: Raycaster

    constructor(public experience: Experience) {
        if (this.experience.debug.active) {
            this.debugFolder = this.experience.debug.debugger.addFolder('Target Params')
        }

        this.raycaster = new Raycaster(this.experience)

        this.setGeometry()
        this.setPositions()
        this.setMeshes()
        this.setDebug()

        this.raycaster.addObjects(this.meshes)
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(0.1, 32)
    }

    setPositions() {
        this.positions = [
            { x: 0.13, y: 0.08, z: -0.34 },
            { x: -0.853, y: 0.08, z: -0.698 },
            { x: 0.501, y: 0.08, z: -0.853 },
            { x: -0.891, y: 0.08, z: 0.385 },
            { x: 0.733, y: 0.08, z: 0.965 }
        ]
    }

    setMeshes() {
        this.positions.forEach((pos: TargetProjectPositionParams) => {
            const material = new THREE.MeshBasicMaterial({
                color: COLORS.primary,
                transparent: true,
                opacity: OPACITIES.default
            })

            this.debugFolder.add(material, 'opacity').min(0).max(1).step(0.1).name('Opacity')

            const mesh = new THREE.Mesh(this.geometry, material)
            mesh.rotation.x = BASIC_ROTATION
            mesh.position.set(pos.x, pos.y, pos.z)

            this.experience.scene.add(mesh)
            this.meshes.push(mesh)
        })

    }

    setDebug() {
        const debug = this.experience.debug
        debug.settings.circleRadius = 0.1

        this.debugFolder
            .add(debug.settings, 'circleRadius')
            .min(0)
            .max(1.618)
            .step(0.001)
            .name("Target Radius")
            .onChange((value: number) => {
                this.updateCircleRadius(value)
            })
    }

    private updateCircleRadius(value: number) {
        this.meshes.forEach((mesh: THREE.Mesh) => {
            const newGeometry = new THREE.CircleGeometry(value, 32)
            mesh.geometry.dispose()
            mesh.geometry = newGeometry
        })
    }
}