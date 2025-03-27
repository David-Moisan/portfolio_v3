import * as THREE from 'three';
import GUI from "lil-gui";
import Experience from "@/app/experience";
import { TargetProjectPositionParams } from '@/types/targetProjectType';
import { BASIC_ROTATION } from '../types/transformation';
import Raycaster from '../utils/raycaster';
import { COLORS, OPACITIES } from '../types/style';
import gsap from 'gsap';

export default class TargetProject {
    public debugFolder!: GUI
    public positions!: TargetProjectPositionParams[]
    public meshes: (THREE.Mesh | THREE.Group)[] = []
    private raycaster: Raycaster

    constructor(public experience: Experience) {
        if (this.experience.debug.active) {
            this.debugFolder = this.experience.debug.debugger.addFolder('Target Params')
        }

        this.raycaster = new Raycaster(this.experience)

        this.setPositions()
        this.setMeshes()
        this.setDebug()

        this.raycaster.addObjects(this.meshes)
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
            const group = new THREE.Group()

            // Ring futuriste
            const radius = this.experience.debug.settings.circleRadius || 0.1
            const segments = 32
            const arcAngle = Math.PI * 1.5 // 270° pour un effet découpé
            const ringGeometry = new THREE.RingGeometry(radius * 0.8, radius, segments, 1, 0, arcAngle)

            // Cercle central
            const circleGeometry = new THREE.CircleGeometry(radius / 2, 32)
            const material = new THREE.MeshBasicMaterial({
                color: COLORS.primary,
                transparent: true,
                opacity: OPACITIES.default
            })

            const ringMesh = new THREE.Mesh(ringGeometry, material)
            const circleMesh = new THREE.Mesh(circleGeometry, material)

            group.add(ringMesh, circleMesh)

            group.rotation.x = BASIC_ROTATION
            group.position.set(pos.x, pos.y, pos.z)

            this.startPulseAnimation(group)
            this.experience.scene.add(group)
            this.meshes.push(group)
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
        this.meshes.forEach((mesh: any) => {
            const newGeometry = new THREE.CircleGeometry(value, 32)
            mesh.geometry.dispose()
            mesh.geometry = newGeometry
        })
    }

    private startPulseAnimation(group: THREE.Group) {
        group.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                gsap.to(child.scale, {
                    x: 1.1, y: 1.1, z: 1.1,
                    duration: 1,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                })
                gsap.to(child.material, {
                    opacity: 0.6,
                    duration: 1,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                })
            }
        })
    }
}