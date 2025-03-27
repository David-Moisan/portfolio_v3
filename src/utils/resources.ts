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
        this.loaders.textureLoader = new THREE.TextureLoader()
    }

    startLoading() {
        for(const source of this.sources) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file: any) => {
                    this.sourceLoaded(source, file)
                })
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
}