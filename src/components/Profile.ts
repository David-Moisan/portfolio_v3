import Experience from '../app/experience';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons';

export default class Profile {
    public scene!: THREE.Scene
    public loader!: GLTFLoader
    public camera!: THREE.PerspectiveCamera
    public canvas!: HTMLCanvasElement
    public renderer!: THREE.WebGLRenderer
    public model: THREE.Object3D | null = null
    public container!: HTMLElement

    constructor(public experience: Experience) {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x0f0f0f)

        console.log("scene into profile", this.scene)
        this.loader = new GLTFLoader()
        this.camera = new THREE.PerspectiveCamera(45, this.experience.sizes.width / this.experience.sizes.height, 0.1, 100)
        this.camera.position.set(0, 1.4, 2)
        console.log("camera into profile", this.camera)
        this.container = this.createDOMStructure()
        console.log("container into profile", this.container)
        this.loadModel()
        
        this.canvas = this.container.querySelector("canvas.profil_canvas") as HTMLCanvasElement
        if (!this.canvas) throw new Error("Profil canvas not found")
        
        console.log("canvas ??", this.canvas)
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(this.experience.sizes.width, this.experience.sizes.height)
        this.renderer.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
        this.renderer.setClearColor(0x0f0f0f, 1)
        console.log("renderer ??", this.renderer)
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
                }
            })
            this.model.scale.setScalar(0.4)
            this.model.position.y = 0.5
            this.camera.position.set(-0.25, 1.2, 2.2)

            console.log("model into loadModel", this.model)
            this.scene.add(this.model)
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
                    <h2>AGENT // PHI & CODE</h2>
                    <p><strong>Name :</strong> David Moisan</p>
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
        this.renderer.render(this.scene, this.camera)
    }
}