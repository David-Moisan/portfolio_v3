import NukeOverlay from "../components/NukeOverlay";
import Experience from "../app/experience";
import Loader from "../components/Loader";
import Map from "../components/Map";
import TargetProject from "../components/TargetProject";
import Terminal from "../components/Terminal";
import Profile from "../components/Profile";
import Camera from "../app/camera";
import HolographicTransition from "../utils/transition";

export default class World {
    public map!: Map
    public target!: TargetProject
    public terminal!: Terminal
    public loader!: Loader
    public secret!: NukeOverlay
    public profile!: Profile
    public mapCamera!: Camera
    public transition!: HolographicTransition

    constructor(public experience: Experience) {
        this.loader = new Loader(this.experience)
        this.transition = new HolographicTransition()
    }

    public startAfterLoader(): void {
        this.transition.play(() => {
            this.terminal = new Terminal(this.experience)
            this.map = new Map(this.experience)
            this.target = new TargetProject(this.experience)
            this.secret = new NukeOverlay(this.experience)
        })
    }

    public initProfile(): void {
        if (!this.profile) {
            this.profile = new Profile(this.experience)
        }
    }
}