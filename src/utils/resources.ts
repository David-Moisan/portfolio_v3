import { FontLoader, GLTFLoader, RGBELoader } from "three/examples/jsm/Addons";
import { SourceType } from "../types/sources";
import { EventEmitter } from "./eventEmitter";
import * as THREE from 'three';

export default class Resources extends EventEmitter {
    public items: Record<string, unknown> = {}
    public loaders: Record<string, any> = {}
    public loaded: number = 0
    public toLoad!: number
    
    constructor(public sources: SourceType[]) {
        super()

        this.sources = sources

        //ANCHOR - Setup
        this.toLoad = this.sources.length

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {
            textureLoader: new THREE.TextureLoader(),
            fontLoader: new FontLoader(),
            hdrLoader: new RGBELoader(),
            gltfLoader: new GLTFLoader()
        }
    }

    startLoading() {
        for(const source of this.sources) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path, 
                    (file: THREE.Texture) => this.sourceLoaded(source, file),
                    undefined,
                    (error: ErrorEvent) => this.handleError(source, error)
                )
            } else if (source.type === 'font') {
                this.loaders.fontLoader.load(
                    source.path, 
                    (font: any) => this.sourceLoaded(source, font),
                    undefined,
                    (error: ErrorEvent) => this.handleError(source, error) 
                )
            } else if (source.type === 'hdr') {
                this.loaders.hdrLoader.load(
                    source.path,
                    (file: THREE.Texture) => {
                        file.mapping = THREE.EquirectangularReflectionMapping
                        this.sourceLoaded(source, file)
                    },
                    undefined,
                    (error: ErrorEvent) => this.handleError(source, error)
                )
            } else if (source.type === "gltf") {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file: any) => this.sourceLoaded(source, file),
                    undefined,
                    (error: ErrorEvent) => this.handleError(source, error)
                )
            }
        }
    }

    sourceLoaded(source: SourceType, file: any) {
        this.items[source.name] = file
        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }

    private handleError(source: SourceType, error: ErrorEvent) {
        console.error(`Error loading ${source.name}:`, error);
        this.loaded++;
    }
}