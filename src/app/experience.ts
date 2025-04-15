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
import Terminal from '../components/Terminal'
import Router from '../utils/router'

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
    public terminal!: Terminal
    public router!: Router

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
        this.terminal = new Terminal(this)
        this.router = new Router(this)

        if (this.debug.active) {
            this.debugFolder = this.debug.debugger.addFolder('General Settings')
            this.debugFolder.add(this.camera.controls, 'enabled').name('Controls Enabled')
        }

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })

    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.renderer.update()
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