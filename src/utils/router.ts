import Experience from "@/app/experience";

export default class Router {
    constructor(private experience: Experience) {}

    public navigate(route: string) {
        switch (route) {
            case "home":
                this.experience.terminal.showFullScreen()
                document.getElementById("map_container")!.style.display = "none"
                document.getElementById("profile_container")!.style.display = "none"
                break
            case "projects": 
                this.experience.terminal.minimizeScreen()
                document.getElementById("map_container")!.style.display = "block"
                document.getElementById("profile_container")!.style.display = "none"
                break
            case "profil": 
                this.experience.terminal.minimizeScreen()
                document.getElementById("map_container")!.style.display = "none"
                document.getElementById("profile_container")!.style.display = "block"
        }

        history.pushState({ page: route }, "", `#${route}`)
    }
}