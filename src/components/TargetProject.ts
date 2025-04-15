import * as THREE from 'three';
import GUI from "lil-gui";
import Experience from "@/app/experience";
import { BASIC_ROTATION } from '../types/transformation';
import Raycaster from '../utils/raycaster';
import { COLORS, OPACITIES } from '../types/style';
import Animation from '../utils/animation';
import { TextGeometry } from 'three/examples/jsm/Addons';
import { TargetData, TargetModalData } from '../types/targetProjectType';
import UIModal from './UIModal';

export default class TargetProject {
    public targets: TargetData[] = []
    public meshes: THREE.Group[] = []
    public titleLine: THREE.Line | null = null
    public titleMesh: THREE.Mesh | null = null
    public font!: any
    public modalGroup: THREE.Group | null = null
    public modalData: Record<number, TargetModalData> = {}
    private raycaster!: Raycaster
    private uiModal!: UIModal
    private debugFolder!: GUI

    constructor(public experience: Experience) {
        if (this.experience.debug.active) {
            this.debugFolder = this.experience.debug.debugger.addFolder('Target Params')
        }

        this.uiModal = new UIModal()

        this.loadFont()
        this.initTargets()
        this.createMeshes()
        this.initModalData()
        this.setupInteractivity()
    }

    private initTargets() {
        const positions = [
            { x: -0.37, y: 0.08, z: -0.34, title: "JOB STATS" },
            { x: -0.972, y: 0.08, z: -0.317, title: "ALIGN TYPE" },
            { x: 0.001, y: 0.096999, z: -0.853, title: "ANCIENT TEMPLE" },
            { x: -1.391, y: 0.08, z: 0.351, title: "VERONA PROJECT" },
            { x: 0.233, y: 0.08, z: 0.965, title: "PORT FOLIO V2" }
        ]

        this.targets = positions.map(pos => ({
            title: pos.title,
            position: new THREE.Vector3(pos.x, pos.y, pos.z)
        }))
    }

    private createMeshes() {
        const radius = 0.1
        const segments = 32;
        const arcAngle = Math.PI * 1.5 // 270° pour un effet découpé

        this.targets.forEach(target => {
            const group = new THREE.Group()

            const material = new THREE.MeshBasicMaterial({
                color: COLORS.primary,
                transparent: true,
                opacity: OPACITIES.default,
                depthWrite: false
            })

            // Cercle exterieur
            const ringGeometry = new THREE.RingGeometry(radius * 0.8, radius, segments, 1, 0, arcAngle)
            const ring = new THREE.Mesh(ringGeometry, material)

            // Cercle intérieur
            const circleGeometry = new THREE.CircleGeometry(radius / 2, segments)
            const circle = new THREE.Mesh(circleGeometry, material)

            group.rotation.x = BASIC_ROTATION
            group.add(ring, circle)
            group.position.copy(target.position)

            // Animation
            Animation.pulse(circle, 1.1, 1.5)
            Animation.rotate(ring, 34)
            Animation.blink(group, 0.8, 1)

            this.experience.scene.add(group)
            this.meshes.push(group)

        })
    }

    private initModalData() {
        this.modalData = {
            0: {
                title: "JobStats",
                description: "JobStats is a project that uses the France Travail API. This website allows you to have advanced statistics on the job market as a developer in France.",
                date: "2024",
                link: "https://www.jobstats.fr/",
                imageUrl: ""
            },
            1: {
                title: "AlignType",
                description: "Align Type: Rust utility to synchronize types between GraphQL and TypeScript, simplifying your development workflow.",
                date: "2024",
                link: "https://github.com/David-Moisan/alignType/releases/tag/v0.0.1",
            },
            2: {
                title: "Ancient Temple",
                description: "Explore the ancient temple in the barren desert and find treasure.",
                date: "2022",
                link: "https://ancient-temple-by-phi-and-code.vercel.app/",
                imageUrl: ""
            },
            3: {
                title: "Verona Project Blockchain",
                description: "Rust Blockchain, an obscure project that hasn't been released online.",
                date: "2023",
            },
            4: {
                title: "Portfolio v2",
                description: "Old portfolio",
                date: "2022",
                imageUrl: "https://www.cjoint.com/doc/25_03/OCCoBOPac5S_Portfolio.gif"
            },
            5: {
                title: "Trackers",
                description: "Trackers is a revolutionary financial analysis (ongoing project...)",
                date: "2025",
            }
        }
    }

    private loadFont() {
        this.font = this.experience.resources.items.uiFont
    }

    private setupInteractivity() {
        this.raycaster = new Raycaster(this.experience)
        this.raycaster.addObjects(this.meshes)
        this.raycaster.on('hover', (object: THREE.Object3D) => {
            const targetGroup = this.findParentTarget(object)
            
            if (targetGroup && this.font) {
                const targetIndex = this.meshes.indexOf(targetGroup)
                
                if (targetIndex !== -1) {
                    this.showTitle(this.targets[targetIndex].title, targetGroup.position)
                }
            }
        })

        this.raycaster.on('hoverEnd', () => {
            this.clearTitle()
        })

        this.raycaster.on('click', (object: THREE.Object3D) => {
            const targetGroup = this.findParentTarget(object)

            if (targetGroup) {
                const targetIndex = this.meshes.indexOf(targetGroup)
                this.flyToTarget(targetIndex)
                this.showModal(targetIndex)
            }
        })
    }

    private findParentTarget(object: THREE.Object3D): THREE.Group | null {
        let current = object
        
        while (current.parent) {
            if (this.meshes.includes(current.parent as THREE.Group)) {
                return current.parent as THREE.Group
            }
            current = current.parent
        }   

        return null
    }

    private showTitle(title: string, position: THREE.Vector3) {

        this.clearTitle()
        
        const endPoint = new THREE.Vector3(
            position.x,
            position.y + 0.5,
            position.z - 0.3
        )

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([position, endPoint])
        this.titleLine = new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
                color: COLORS.hover,
                linewidth: 2,
                transparent: true,
            })
        )

        Animation.fadeIn(this.titleLine)
        this.experience.scene.add(this.titleLine)

        // Text
        const textGeometry = new TextGeometry(title, {
            font: this.font,
            size: 0.03,
            depth: 0.01,
            curveSegments: 12
        })

        const textMaterial = new THREE.MeshBasicMaterial({ 
            color: COLORS.hover,
            transparent: true,
        })
        this.titleMesh = new THREE.Mesh(textGeometry, textMaterial)

        textGeometry.computeBoundingBox()
        if (textGeometry.boundingBox) {
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x
            this.titleMesh.position.set(
                endPoint.x - textWidth / 2 + 0.0996,
                endPoint.y,
                endPoint.z
            )
        } else {
            this.titleMesh.position.copy(endPoint)
        }

        this.titleMesh.rotation.set(
            -2.8,
            0,
            Math.PI
        )

        this.experience.scene.add(this.titleMesh)
    }

    private showModal(targetIndex: number) {
        const data = this.modalData[targetIndex]

        if (data) {
            this.uiModal.show({
                title: data.title,
                description: data.description,
                date: data.date,
                link: data.link,
                imageUrl: data.imageUrl
            })
        }
    }

    private clearTitle() {
        if (this.titleLine) {
            Animation.fadeOut(this.titleLine)
            this.titleLine = null
        }

        if (this.titleMesh) {
            Animation.fadeOut(this.titleMesh);
            this.titleMesh = null;
        }
    }

    private flyToTarget(targetIndex: number) {
        const target = this.targets[targetIndex]

        if (!target) return

        const camera = this.experience.camera.instance
        const controls = this.experience.camera.controls

        const zoomPosition = new THREE.Vector3(
            target.position.x * 1.5,
            target.position.y + 0.5,
            target.position.z + 1.5
        )

        Animation.flyTo(camera, controls, zoomPosition, target)
    }
}
