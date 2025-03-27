import Experience from "../app/experience";
import Map from "./Map";
import TargetProject from "./TargetProject";

export default class World {
    public map!: Map
    public target!: TargetProject

    constructor(public experience: Experience) {

        this.experience.resources.on('ready', () => {
            this.map = new Map(this.experience)
            this.target = new TargetProject(this.experience)
        })
    }
}