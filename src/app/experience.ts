import * as THREE from 'three'
import GUI from 'lil-gui'
import Time from "../utils/time"
import Sizes from "../utils/sizes"
import Camera from './camera'
import Renderer from './renderer'
import World from '../core/World'
import Resources from '../utils/resources'
import { sources } from '../types/sources'
import Debug from '../utils/debug'
import Router from '../utils/router'
import AudioManager from '../utils/audioManager'
import Profile from '../components/Profile'
import { Sky } from 'three/examples/jsm/Addons'

// Singleton
let instance: Experience | null = null

export default class Experience {
    public sizes: Sizes = new Sizes()
    public time: Time = new Time()
    public scene!: THREE.Scene
    public rootGroup!: THREE.Group
    public camera!: Camera
    public renderer!: Renderer
    public resources!: Resources
    public world!: World
    public debug!: Debug
    public debugFolder!: GUI
    public router!: Router
    public profileScene?: Profile
    public currentScene: "map" | "profile" = "map"
    private wasOnProfile: boolean = false

    constructor(public canvas: HTMLCanvasElement) {
        if (instance) {
            return instance
        }
        instance = this

        AudioManager.playBackgroundMusic()

        //ANCHOR - Options
        this.canvas = canvas

        //ANCHOR - Setup
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.resources = new Resources(sources)
        this.world = new World(this)
        this.debug = new Debug(this)
        this.router = new Router(this)

        // Group creation
        this.scene = new THREE.Scene()
        this.createFogVolume()

        this.rootGroup = new THREE.Group()

        this.scene.add(this.rootGroup)


        if (this.debug.active) {
            this.debugFolder = this.debug.debugger.addFolder('General Settings')
            this.debugFolder.add(this.camera.controls, 'enabled').name('Controls Enabled')
        }

        this.sizes.on('resize', () => this.resize())
        this.time.on('tick', () => this.update())
    }

    createFogVolume() {
        const sky = new Sky()
        sky.scale.setScalar(100)
        this.scene.add(sky)

        const skyUniforms = sky.material.uniforms
        skyUniforms.turbidity.value = 10;
        skyUniforms.rayleigh.value = 3; 
        skyUniforms.mieCoefficient.value = 0.1;
        skyUniforms.mieDirectionalG.value = 0.95;
        skyUniforms.sunPosition.value.set(0.3, -0.038, -0.95)

        this.scene.fog = new THREE.FogExp2(0x04343f, 0.1)
    }

    public setScene(name: "map" | "profile") {
        this.currentScene = name

        if (name === "profile" && !this.profileScene) {
            this.initProfileScene()
        }
    }

    public initProfileScene() {
        this.profileScene = new Profile(this)
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()

        if (this.currentScene === "profile" && this.world.profile) {
            this.world.profile.resize()
        }
    }

    update() {
        if (this.currentScene === "map") {
            this.camera.update()
            this.camera.controls.update()
            this.renderer.instance.render(this.scene, this.camera.instance)
            this.wasOnProfile = false
        }

        if (this.currentScene === "profile" && this.profileScene) {
            this.profileScene.update()

            if (!this.wasOnProfile) {
                this.profileScene.startScan()
                this.wasOnProfile = true
            }
            this.renderer.instance.render(this.profileScene.scene, this.profileScene.camera)
        }
    }
}