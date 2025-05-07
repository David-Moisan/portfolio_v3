import SFXManager from '../utils/sfxManager';
import Experience from '../app/experience';
import * as THREE from 'three';
import profileVertex from "../shaders/profileVertex.glsl"
import profileFragment from "../shaders/profileFragment.glsl"
import { COLORS, DOMStyle } from '../types/style';
import { GLTF } from 'three/examples/jsm/Addons';
import { sectionProfile } from '../types/dom';

export default class Profile {
    public scene!: THREE.Scene
    public camera!: THREE.PerspectiveCamera
    public model: THREE.Object3D | null = null
    public glowModel!: THREE.Object3D
    public container!: HTMLElement
    public canvas!: HTMLCanvasElement
    private scanInProgress: boolean = false
    private scanStartTime: number = 0
    private scanDuration: number = 1500
    private scanning: boolean = false
    public renderer!: THREE.WebGLRenderer
    private scanUniforms = {
        uScanY: { value: -1 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(COLORS.aqua) }
    }

    constructor(public experience: Experience) {

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, this.experience.sizes.width / this.experience.sizes.height, 0.1, 100)
        this.camera.position.set(0, 1.4, 2)

        this.container = this.createDOMStructure()

        this.canvas = this.container.querySelector("canvas.profil_canvas") as HTMLCanvasElement
        if (!this.canvas) throw new Error("Profile canvas not found")
        
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(this.experience.sizes.width, this.experience.sizes.height)
        this.renderer.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
        this.renderer.setClearColor(COLORS.black, 1)

        this.experience.time.on('tick', () => this.updateScan())
        
        this.init()
    }

    private async init() {
        const hdrTexture = this.experience.resources.items.profileEnvironment as THREE.Texture
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = hdrTexture
        this.scene.background = hdrTexture

        await this.waitNextFrame()
        this.loadModel()
    }

    private waitNextFrame(): Promise<void> {
        return new Promise(resolve => requestAnimationFrame(() => resolve()))
    }

    private loadModel() {

        const gltf = this.experience.resources.items.profileModel as GLTF
        this.model = gltf.scene

        this.model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
        
                mesh.material = new THREE.MeshBasicMaterial({
                    color: COLORS.aqua,
                    wireframe: true
                })
        
                const glowMaterial = new THREE.ShaderMaterial({
                    uniforms: this.scanUniforms,
                    vertexShader: profileVertex,
                    fragmentShader: profileFragment,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                })
        
                this.glowModel = new THREE.Mesh(mesh.geometry, glowMaterial)
        
                this.scene.add(this.glowModel)
            }
        })

        this.model.scale.setScalar(0.4)
        this.model.position.y = 0.5
        this.camera.position.set(-0.25, 1.2, 2.2)

        this.glowModel.position.copy(this.model.position)
        this.glowModel.scale.copy(this.model.scale).multiplyScalar(1.005)

        this.scene.add(this.model)

        requestAnimationFrame(() => {
            const section = document.getElementById("profile_container")
            if (section) section.style.opacity = DOMStyle.visibleOpacity
        })
    }

    resize() {
        this.camera.aspect = this.experience.sizes.width / this.experience.sizes.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.experience.sizes.width, this.experience.sizes.height)
        this.renderer.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
    }

    private createDOMStructure(): HTMLElement {
        const section = document.createElement("section")
        section.id = "profile_container"
        section.innerHTML = sectionProfile
        document.body.appendChild(section)

        return section
    }

    update() {
        if (this.model) this.model.rotation.y += 0.003
        if (this.glowModel) this.glowModel.rotation.copy(this.model!.rotation)
        this.renderer.render(this.scene, this.camera)
    }

    startScan() {
        if (this.scanning && this.scanInProgress) return
        this.scanning = true
        this.scanInProgress = true
        this.scanStartTime = this.experience.time.elapsed

        const card = this.container.querySelector(".profile-card") as HTMLElement

        if (card) {
            card.style.opacity = DOMStyle.fullOpacity
            card.style.transition = DOMStyle.opacityTransition

            SFXManager.playScanSound()

            setTimeout(() => {
                card.style.opacity = DOMStyle.visibleOpacity
                this.scanInProgress = false
            }, 2700)
        }
    }

    updateScan() {
        if (!this.scanning) return

        const elapsed = this.experience.time.elapsed - this.scanStartTime
        const progress = elapsed / this.scanDuration

        const scanY = THREE.MathUtils.lerp(-1, 4, progress)
        this.scanUniforms.uScanY.value = scanY

        if (progress >= 1) {
            this.scanning = false
            this.scanUniforms.uScanY.value = 4

            const card = this.container.querySelector(".profile-card") as HTMLElement

            if (card) {
                card.style.opacity = DOMStyle.visibleOpacity
            }
        }
    }
}