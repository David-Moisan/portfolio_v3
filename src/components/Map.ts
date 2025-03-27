import * as THREE from 'three';
import GUI from "lil-gui";
import Experience from "@/app/experience";
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import { BASIC_ROTATION } from '../types/transformation';

export default class Map {
    public geometry!: THREE.PlaneGeometry
    public textures!: any
    public material!: THREE.ShaderMaterial
    public mesh!: THREE.Mesh
    public debugFolder!: GUI
    public helper!: THREE.AxesHelper

    constructor(public experience: Experience) {

        // Debug
        if (this.experience.debug.active) {
            this.debugFolder = this.experience.debug.debugger.addFolder('Map Params')
            this.helper = new THREE.AxesHelper(5)
            this.experience.scene.add(this.helper)
        }

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(2.5, 2.5, 256, 256)
    }

    setTextures() {
        this.textures = {}
        this.textures.material = this.experience.resources.items.environmentMapTexture
        this.textures.material.wrapS = THREE.ClampToEdgeWrapping
        this.textures.material.wrapT = THREE.ClampToEdgeWrapping
        this.textures.material.minFilter = THREE.LinearFilter 
        this.textures.material.magFilter = THREE.LinearFilter 
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            wireframe: true,
            uniforms: {
                uTime: { value:  0},
                uMap: { value: this.textures.material },
                uElevationScale: { value: 0.2 },
            },
        })

        this.debugFolder.add(this.material.uniforms.uElevationScale, 'value').min(0).max(1).step(0.01).name('Elevation Scale')
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = BASIC_ROTATION
        this.experience.scene.add(this.mesh)
    }
}