import * as THREE from 'three'
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

        console.log(this.world)

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
}