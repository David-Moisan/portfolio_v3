import SFXManager from '../utils/sfxManager';
import Experience from '../app/experience';
import * as THREE from 'three';
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons';
import profileVertex from "../shaders/profileVertex.glsl"
import profileFragment from "../shaders/profileFragment.glsl"

export default class Profile {
    public scene!: THREE.Scene
    public loader!: GLTFLoader
    public camera!: THREE.PerspectiveCamera
    public canvas!: HTMLCanvasElement
    public renderer!: THREE.WebGLRenderer
    public model: THREE.Object3D | null = null
    public glowModel!: THREE.Object3D
    public container!: HTMLElement
    private scanInProgress: boolean = false
    private scanStartTime: number = 0
    private scanDuration: number = 1500
    private scanning: boolean = false
    private scanUniforms = {
        uScanY: { value: -1 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ffff) }
    }

    constructor(public experience: Experience) {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x0f0f0f)

        this.loader = new GLTFLoader()
        this.camera = new THREE.PerspectiveCamera(45, this.experience.sizes.width / this.experience.sizes.height, 0.1, 100)
        this.camera.position.set(0, 1.4, 2)
        this.container = this.createDOMStructure()
        this.setupEnvironment()
        this.loadModel()
        
        this.canvas = this.container.querySelector("canvas.profil_canvas") as HTMLCanvasElement
        if (!this.canvas) throw new Error("Profile canvas not found")
        
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(this.experience.sizes.width, this.experience.sizes.height)
        this.renderer.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
        this.renderer.setClearColor(0x0f0f0f, 1)

        this.experience.time.on('tick', () => this.updateScan())
    }

    setupEnvironment() {
        const loader = new RGBELoader()
        const env = loader.load('textures/hdr/futuristic_command_center_2K.hdr')

        if (env) {
            env.mapping = THREE.EquirectangularReflectionMapping
    
            const envGeometry = new THREE.SphereGeometry(50, 64, 64)
            const envMaterial = new THREE.MeshBasicMaterial({
                map: env,
                side: THREE.BackSide
            })
            const envMesh = new THREE.Mesh(envGeometry, envMaterial)
            envMesh.position.y = -3
            envMesh.position.x = -3
            this.scene.add(envMesh)
        }
    }

    private loadModel() {
        this.loader.load('/models/gltf/LeePerrySmith.glb', (gltf) => {
            this.model = gltf.scene
            this.model.traverse((child) => {

                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh

                    mesh.material = new THREE.MeshBasicMaterial({
                        color: 0x00ffff,
                        wireframe: true
                    })

                    const glowMaterial = new THREE.ShaderMaterial({
                        uniforms: this.scanUniforms,
                        vertexShader: profileVertex,
                        fragmentShader: profileFragment,
                        transparent: true,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending,
                        wireframe: true,
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
            this.startScan()
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
        section.innerHTML = `
        <div id="profil_wrapper">
                <div class="profile-card">
                    <h2>PROFILE</h2>
                    <p><strong>Real Name :</strong> David Moisan</p>
                    <p><strong>Code Name :</strong> PHI_AND_CODE</p>
                    <p><strong>Skills :</strong> TS / Three.js / WebGL / Rust / Node / PHP</p>
                    <p><strong>Last Location :</strong> 🇫🇷 France</p>
                    <p><strong>Contact :</strong> <a href="mailto:davprocode@gmail.com">☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎☠︎︎</a></p>
                </div>
                <canvas class="profil_canvas"></canvas>
            </div>
        `

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
            card.style.opacity = '0'
            card.style.transition = 'opacity 0.5s ease'

            SFXManager.playScanSound()

            setTimeout(() => {
                card.style.opacity = '1'
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
                card.style.opacity = '1'
            }
        }
    }
}