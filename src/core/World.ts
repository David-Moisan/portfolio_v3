import NukeOverlay from "../components/NukeOverlay";
import Experience from "../app/experience";
import Loader from "../components/Loader";
import Map from "../components/Map";
import TargetProject from "../components/TargetProject";
import Terminal from "../components/Terminal";

export default class World {
    public map!: Map
    public target!: TargetProject
    public terminal!: Terminal
    public loader!: Loader
    public secret!: NukeOverlay

    constructor(public experience: Experience) {

        this.experience.resources.on('ready', () => {
            this.loader = new Loader(this.experience)
            this.map = new Map(this.experience)
            this.target = new TargetProject(this.experience)
            this.terminal = new Terminal(this.experience)
            this.secret = new NukeOverlay(this.experience)
        })
    }
}