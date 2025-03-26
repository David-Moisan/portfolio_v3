import Experience from "../app/experience";
import * as THREE from 'three';
import Map from "./Map";

export default class World {
    public map!: Map

    constructor(public experience: Experience) {

        this.experience.resources.on('ready', () => {
            this.map = new Map(this.experience)
        })
    }
}