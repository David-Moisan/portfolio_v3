import * as THREE from 'three';
import GUI from "lil-gui";
import Experience from "@/app/experience";
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import { BASIC_ROTATION } from '../types/transformation';
import { RGBELoader } from 'three/examples/jsm/Addons';
import { COLORS } from '../types/style';

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

        this.setupEnvironment()
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setCity()
        this.setFakeHUD()
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
            this.experience.rootGroup.add(envMesh)
        }
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
            wireframe: false,
            uniforms: {
                uTime: { value: 0 },
                uMap: { value: this.textures.material },
                uGridTexture: { value: this.textures.gridMaterial },
                uNormalMap: { value: this.textures.normalMap },
                uElevationScale: { value: 0.40 },
                uNormalStrength: { value: 0.55 },
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

    setCity() {
        const cityGltf = this.experience.resources.items.cityModel as any
        const cityScene = cityGltf.scene

        cityScene.scale.setScalar(0.01)
        cityScene.position.set(2.5, 0.1, 0)
        cityScene.rotation.y = Math.PI 

        cityScene.traverse((child : any) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(COLORS.cyprus),
                    transparent: true,
                    opacity: 0.6,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                })
            }
        })

        this.experience.rootGroup.add(cityScene)
    }

    setFakeHUD() {
        const group = new THREE.Group()

         // === 2. Flux de Data Streams ===
        const dataPoints = []
        const streamMaterial = new THREE.PointsMaterial({
            size: 0.01,
            color: COLORS.brightTurquoise,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        for (let i = 0; i < 100; i++) {
            const x = (Math.random() - 0.5) * 12
            const z = (Math.random() - 0.5) * 10
            const y = 0.1 + Math.random() * 0.5
            dataPoints.push(new THREE.Vector3(x, y, z))
        }

        const dataGeom = new THREE.BufferGeometry().setFromPoints(dataPoints)
        const dataStream = new THREE.Points(dataGeom, streamMaterial)
        group.add(dataStream)

        // === 5. Drones de scan tournants ===
        const drones = [] as THREE.Object3D[]

        const droneModel = (this.experience.resources.items.droneModel as any).scene

        for (let i = 0; i < 3; i++) {
            const drone = droneModel.clone()
            drone.scale.set(0.05, 0.05, 0.05)
            drone.position.set(
                Math.cos(i * Math.PI * 2 / 3) * 2.0,
                0.5,
                Math.sin(i * Math.PI * 2 / 3) * 2.0
            )

            group.add(drone)
            drones.push(drone)
        }

        this.experience.rootGroup.add(group)

        // === 🎯 Animation interne
        const animate = () => {
            const time = performance.now() * 0.001

            const y = Math.sin(time * 2.0) * 0.2
            const x = Math.sin(y * 13.0 + Math.cos(y * 0.618)) * 0.15

            dataStream.position.y = y
            dataStream.position.x = x

            drones.forEach((drone: any, idx: number) => {
                const angle = time + idx * 2
                const radius = 2.0
                drone.position.x = Math.cos(angle) * radius
                drone.position.z = Math.sin(angle) * radius
                drone.rotation.y = angle
            })

            requestAnimationFrame(animate)
        }

        animate()
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