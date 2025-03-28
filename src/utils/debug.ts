import Experience from "@/app/experience";
import GUI from "lil-gui";

export default class Debug {
    public active: boolean
    public debugger!: GUI
    public settings: Record<string, any> = {}

    constructor(public experience: Experience) {
        this.active = window.location.hash === '#debug'

        if (this.active) {
            this.debugger = new GUI({
                title: "Debug GUI",
                width: 340,
                closeFolders: true
            })
        }
    }
}