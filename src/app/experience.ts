import * as THREE from 'three'
import GUI from 'lil-gui'
import Time from "../utils/time"
import Sizes from "../utils/sizes"
import Camera from './camera'
import Renderer from './renderer'
import World from '../components/World'
import Resources from '../utils/resources'
import { sources } from '../types/sources'
import Debug from '../utils/debug'

// Singleton
let instance: Experience | null = null

export default class Experience {
    public sizes: Sizes = new Sizes()
    public time: Time = new Time()
    public scene: THREE.Scene = new THREE.Scene()
    public camera!: Camera
    public renderer!: Renderer
    public resources!: Resources
    public world!: World
    public debug!: Debug
    public debugFolder!: GUI

    constructor(public canvas: HTMLCanvasElement) {
        if (instance) {
            return instance
        }
        instance = this

        //ANCHOR - Options
        this.canvas = canvas

        //ANCHOR - Setup
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.resources = new Resources(sources)
        this.world = new World(this)
        this.debug = new Debug(this)

        if (this.debug.active) {
            this.debugFolder = this.debug.debugger.addFolder('General Settings')
        }

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })

        this.setGeneralDebug()
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.renderer.update()
    }

    setGeneralDebug() {
        this.debugFolder.add(this.camera.controls, 'enabled').name('Controls Enabled')
        // this.debugFolder.add(this.camera.instance.position, 'x').min(-10).max(10).step(0.01).name("Camera Axes X")
        // this.debugFolder.add(this.camera.instance.position, 'y').min(-10).max(10).step(0.01).name("Camera Axes Y")
        // this.debugFolder.add(this.camera.instance.position, 'z').min(-10).max(10).step(0.01).name("Camera Axes Z")
        
        // this.debugFolder.add(this.camera.instance.rotation, 'x').min(0).max(10).step(0.01).name("Camera Rotation Axes X")
        // this.debugFolder.add(this.camera.instance.rotation, 'y').min(0).max(10).step(0.01).name("Camera Rotation Axes Y")
        // this.debugFolder.add(this.camera.instance.rotation, 'z').min(0).max(10).step(0.01).name("Camera Rotation Axes Z")

    }

    // destroy() {
    //     this.sizes.off('resize')
    //     this.time.off('tick')

    //     // Traverse the whole scene
    //     this.scene.traverse((child: any) => {
    //         if (child instanceof THREE.Mesh) {
    //             child.geometry.dispose()

    //             // Loop through the material properties
    //             for (const key in child.material) {
    //                 const value = child.material[key]

    //                 if (value && typeof value.dispose === 'function') {
    //                     value.dispose()
    //                 }
    //             }
    //         }
    //     })

    //     this.camera.controls.dispose()
    //     this.renderer.instance.dispose()

    //     if (this.debug.active) {
    //         this.debug.debugger.destroy()
    //     }
    // }
}