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
    public container!: HTMLElement

    constructor(public experience: Experience) {
        this.container = this.createDOMStructure();
        
        // Debug
        if (this.experience.debug.active) {

            const axesHelper = new THREE.AxesHelper(5)
            this.experience.rootGroup.add(axesHelper)

            const gridHelper = new THREE.GridHelper(10, 10)
            this.experience.rootGroup.add(gridHelper)
            this.debugFolder = this.experience.debug.debugger.addFolder('Map Params')
        }

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(10, 10, 512, 512)
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
            uniforms: {
                uTime: { value: 0 },
                uMap: { value: this.textures.material },
                uGridTexture: { value: this.textures.gridMaterial },
                uNormalMap: { value: this.textures.normalMap },
                uElevationScale: { value: 0.34 },
                uNormalStrength: { value: 0.55 }
            }
        })
        
        if (this.experience.debug.active) {
            this.debugFolder.add(this.material.uniforms.uElevationScale, 'value').min(0).max(1).step(0.01).name('Elevation Scale')
            this.debugFolder.add(this.material, 'wireframe').name('Wireframe')
            this.debugFolder.add(this.material.uniforms.uNormalStrength, 'value').min(0).max(10).step(0.01).name('Detail Normal Scale')
            this.debugFolder.add(this.experience.camera.instance.position, 'x').min(-10).max(10).step(0.01)
            this.debugFolder.add(this.experience.camera.instance.position, 'y').min(-10).max(10).step(0.01)
            this.debugFolder.add(this.experience.camera.instance.position, 'z').min(-10).max(10).step(0.01)
        }
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = 1.50
        this.mesh.rotation.z = Math.PI
        this.mesh.rotation.x = BASIC_ROTATION
        this.experience.rootGroup.add(this.mesh)
    }

    createDOMStructure(): HTMLElement {
        const wrapper = document.getElementById("map_wrapper")
        const headerSource = document.createElement("div")
        headerSource.classList.add("header-source")
        
        if (wrapper) {
            headerSource.innerHTML = `
                <span>SOURCE: CIA</span>
                <span>SOURCE: FBI</span>
                <span>SOURCE: U.S. STATE DEPARTMENT</span>
            `
        }

        headerSource.style.display = "flex"

        wrapper!.appendChild(headerSource)
        return headerSource
    }
}