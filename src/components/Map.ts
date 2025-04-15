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
            // this.helper = new THREE.AxesHelper(5)
            // this.experience.scene.add(this.helper)
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

        // Height Map for elevation
        this.textures.material = this.experience.resources.items.environmentMapTexture
        this.textures.material.wrapS = THREE.ClampToEdgeWrapping
        this.textures.material.wrapT = THREE.ClampToEdgeWrapping
        this.textures.material.minFilter = THREE.LinearFilter 
        this.textures.material.magFilter = THREE.LinearFilter 
        
        // Normal Map for surface detail
        this.textures.normalMap = this.experience.resources.items.environmentMapNormalTexture
        this.textures.normalMap.wrapS = THREE.RepeatWrapping
        this.textures.normalMap.wrapT = THREE.RepeatWrapping
        this.textures.normalMap.minFilter = THREE.LinearFilter 
        this.textures.normalMap.magFilter = THREE.LinearFilter

        // Text Texture for style of grid
        this.textures.gridMaterial = this.experience.resources.items.gridMapTexture
        this.textures.gridMaterial.wrapS = THREE.RepeatWrapping
        this.textures.gridMaterial.wrapT = THREE.RepeatWrapping
        this.textures.gridMaterial.minFilter = THREE.LinearFilter
        this.textures.gridMaterial.magFilter = THREE.LinearFilter
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            // wireframe: true,
            uniforms: {
                uTime: { value:  0},
                uMap: { value: this.textures.material },
                uGridTexture: { value: this.textures.gridMaterial },
                uNormalMap: { value: this.textures.normalMap },
                uElevationScale: { value: 0.28 },
                uNormalStrength: { value: 1.59 }
            },
        })

        if (this.experience.debug.active) {
            this.debugFolder.add(this.material.uniforms.uElevationScale, 'value').min(0).max(1).step(0.01).name('Elevation Scale')
            this.debugFolder.add(this.material, 'wireframe').name('Wireframe')
            this.debugFolder.add(this.material.uniforms.uNormalStrength, 'value').min(0).max(10).step(0.01).name('Detail Normal Scale')
        }
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = -0.5
        this.mesh.rotation.x = BASIC_ROTATION
        this.experience.scene.add(this.mesh)
    }
}