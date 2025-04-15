import Experience from '../app/experience';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons';

export default class Profile {
    public scene!: THREE.Scene
    private loader!: GLTFLoader
    public camera!: THREE.PerspectiveCamera
    private model: THREE.Object3D | null = null

    constructor(private experience: Experience) {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x0f0f0f)
        this.loader = new GLTFLoader()
        this.camera = new THREE.PerspectiveCamera(45, this.experience.sizes.width / this.experience.sizes.height, 0.1, 100)
        this.camera.position.set(0, 1.4, 2)

        this.loadModel()

        window.addEventListener("resize", () => this.onResize())
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
            this.model.scale.set(1, 1, 1)
            this.model.position.y = -1

            this.scene.add(this.model)
        })
    }

    private onResize() {
        this.camera.aspect = this.experience.sizes.width / this.experience.sizes.height
        this.camera.updateProjectionMatrix()
    }

    public update() {
        if (this.model) {
            this.model.rotation.y += 0.003
        }
    }
}