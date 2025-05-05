import * as THREE from 'three';
import GUI from "lil-gui";
import Experience from "@/app/experience";
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
        this.createScannerNetworkEffect()
        this.initModalData()
        this.setupInteractivity()
    }

    private initTargets() {
        const offset = 3
        const offsetZ = 2
        const positions = [
            { x: -0.37 * offset, y: 0.08 * offsetZ, z: -0.34 * offset, title: "JOB STATS" },
            { x: -0.972 * offset, y: 0.08 * offsetZ, z: -0.317 * offset, title: "ALIGN TYPE" },
            { x: 0.001 * offset, y: 0.096999 * offsetZ, z: -0.853 * offset, title: "ANCIENT TEMPLE" },
            { x: -1.391 * offset, y: 0.08 * offsetZ, z: 0.351 * offset, title: "VERONA PROJECT" },
            { x: 0.233 * offset, y: 0.08 * offsetZ, z: 0.965 * offset, title: "PORT FOLIO V2" }
        ]

        this.targets = positions.map(pos => ({
            title: pos.title,
            position: new THREE.Vector3(-pos.x, pos.y, -pos.z)
        }))
    }

    private createMeshes() {
        const radius = 0.1
        const segments = 32;
        const arcAngle = Math.PI * 1.5 // 270° pour un effet découpé

        this.targets.forEach(target => {
            const group = new THREE.Group()

            const material = new THREE.MeshBasicMaterial({
                color: COLORS.hover,
                transparent: true,
                depthWrite: false
            })

            // Cercle exterieur
            const ringGeometry = new THREE.RingGeometry(radius * 0.8, radius, segments, 1, 0, arcAngle)
            const ring = new THREE.Mesh(ringGeometry, material)

            // Cercle intérieur
            const circleGeometry = new THREE.CircleGeometry(radius / 2, segments)
            const circle = new THREE.Mesh(circleGeometry, material)

            group.rotation.set(
                -Math.PI / 2,
                0,
                Math.PI
            )
        
            group.add(ring, circle)
            group.position.copy(target.position)

            // Animation
            Animation.pulse(circle, 1.1, 1.5)
            Animation.rotate(ring, 34)

            this.experience.rootGroup.add(group)
            this.meshes.push(group)

        })
    }

    private createScannerNetworkEffect() {
        const group = new THREE.Group()
    
        const primaryPositions: THREE.Vector3[] = this.targets.map(t => t.position.clone())
        const extraCount = 80
        const extraPositions: THREE.Vector3[] = []
    
        for (let i = 0; i < extraCount; i++) {
            const a = primaryPositions[Math.floor(Math.random() * primaryPositions.length)]
            const b = primaryPositions[Math.floor(Math.random() * primaryPositions.length)]
            const t = Math.random()
            const pos = new THREE.Vector3().lerpVectors(a, b, t)
            pos.x += (Math.random() - 0.5) * 4
            pos.z += (Math.random() - 0.5) * 4
            extraPositions.push(pos)
        }
    
        const allPoints = [...primaryPositions, ...extraPositions]
        const pointArray = new Float32Array(allPoints.length * 3)
    
        allPoints.forEach((pos, i) => {
            pointArray[i * 3 + 0] = pos.x
            pointArray[i * 3 + 1] = pos.y
            pointArray[i * 3 + 2] = pos.z
        })
    
        const pointGeometry = new THREE.BufferGeometry()
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointArray, 3))
    
        const pointMaterial = new THREE.PointsMaterial({
            size: 0.07,
            color: COLORS.hover,
            blending: THREE.AdditiveBlending
        })
    
        const points = new THREE.Points(pointGeometry, pointMaterial)
        group.add(points)
    
        // === 🔗 Lignes principales
        const mainConnections: THREE.Vector3[] = []
    
        this.targets.forEach((target, i) => {
            const others = this.targets.slice()
            others.splice(i, 1)
            const closest = others
                .map(o => ({
                    pos: o.position,
                    dist: target.position.distanceTo(o.position)
                }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 2)
    
            closest.forEach(({ pos }) => {
                mainConnections.push(target.position.clone(), pos.clone())
            })
        })
    
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(mainConnections)
        const baseLineArray = lineGeometry.attributes.position.array.slice()
        const lineColorArray = new Float32Array(mainConnections.length * 3)
    
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColorArray, 3))
        group.add(lines)
    
        // === 🔗 Réseau secondaire (neurones)
        const miniConnections: THREE.Vector3[] = []
    
        extraPositions.forEach((extra) => {
            const closestPrimary = primaryPositions.reduce((closest, current) => {
                const dist = extra.distanceTo(current)
                return dist < closest.dist ? { pos: current, dist } : closest
            }, { pos: primaryPositions[0], dist: Infinity })
    
            miniConnections.push(extra.clone(), closestPrimary.pos.clone())
    
            const others = extraPositions.filter(p => p !== extra)
            const closestExtras = others
                .map(p => ({
                    pos: p,
                    dist: extra.distanceTo(p)
                }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 2)
    
            closestExtras.forEach(({ pos }) => {
                miniConnections.push(extra.clone(), pos.clone())
            })
        })
    
        const miniGeometry = new THREE.BufferGeometry().setFromPoints(miniConnections)
        const miniBaseLineArray = miniGeometry.attributes.position.array.slice()
        const miniColorArray = new Float32Array(miniConnections.length * 3)
    
        const miniMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    
        const miniLines = new THREE.LineSegments(miniGeometry, miniMaterial)
        miniGeometry.setAttribute('color', new THREE.BufferAttribute(miniColorArray, 3))
        group.add(miniLines)
    
        // === 🌊 Radar animation
        const waveRange = 2.5
        const pulseSpeed = 2.0
    
        const animate = () => {
            const time = performance.now() * 0.001
            const pulse = 0.6 + Math.sin(time * 2) * 0.3
            lineMaterial.opacity = pulse
    
            // === Lignes principales - ondulation XZ
            const posAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute
            const colorAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute
    
            for (let i = 0; i < posAttr.count; i++) {
                const baseX = baseLineArray[i * 3 + 0] as number
                const baseY = baseLineArray[i * 3 + 1] as number
                const baseZ = baseLineArray[i * 3 + 2] as number
    
                const offsetX = Math.sin(time * 3 + i) * 0.05
                const offsetZ = Math.cos(time * 3 + i) * 0.05
    
                posAttr.setXYZ(i, baseX + offsetX, baseY, baseZ + offsetZ)
            }
            posAttr.needsUpdate = true
    
            // === Lignes secondaires - ondulation XZ
            const miniPosAttr = miniGeometry.getAttribute('position') as THREE.BufferAttribute
            for (let i = 0; i < miniPosAttr.count; i++) {
                const baseX = miniBaseLineArray[i * 3 + 0] as number
                const baseY = miniBaseLineArray[i * 3 + 1] as number
                const baseZ = miniBaseLineArray[i * 3 + 2] as number
    
                const offsetX = Math.sin(time * 2.5 + i) * 0.02
                const offsetZ = Math.cos(time * 2.5 + i) * 0.02
    
                miniPosAttr.setXYZ(i, baseX + offsetX, baseY, baseZ + offsetZ)
            }
            miniPosAttr.needsUpdate = true
    
            // === Radar Color effect
            const waveCenter = new THREE.Vector3(0, 0, 0)
            const waveRadius = (time * pulseSpeed) % waveRange
    
            const connections = [...mainConnections, ...miniConnections]
    
            for (let i = 0; i < connections.length; i += 2) {
                const a = connections[i]
                const b = connections[i + 1]
                const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
                const dist = waveCenter.distanceTo(mid)
                const intensity = Math.max(0.0, 1.0 - Math.abs(dist - waveRadius))
    
                const baseColor = new THREE.Color(1, 0.6, 0.1).lerp(new THREE.Color(1, 1, 0.4), intensity)
    
                if (i < mainConnections.length) {
                    colorAttr.setXYZ(i * 3 + 0, baseColor.r, baseColor.g, baseColor.b)
                    colorAttr.setXYZ(i * 3 + 1, baseColor.r, baseColor.g, baseColor.b)
                } else {
                    const j = i - mainConnections.length
                    miniColorArray[j * 3 + 0] = baseColor.r
                    miniColorArray[j * 3 + 1] = baseColor.g
                    miniColorArray[j * 3 + 2] = baseColor.b
                    miniColorArray[j * 3 + 3] = baseColor.r
                    miniColorArray[j * 3 + 4] = baseColor.g
                    miniColorArray[j * 3 + 5] = baseColor.b
                }
            }
    
            colorAttr.needsUpdate = true
            miniGeometry.attributes.color.needsUpdate = true
    
            requestAnimationFrame(animate)
        }
    
        animate()
        this.experience.rootGroup.add(group)
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
        this.experience.rootGroup.add(this.titleLine)

        // Text
        const textGeometry = new TextGeometry(title, {
            font: this.font,
            size: 0.05,
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
        
        this.titleMesh.lookAt(this.experience.camera.instance.position)
        this.experience.rootGroup.add(this.titleMesh)
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
}
