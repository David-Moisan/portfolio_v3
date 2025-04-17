import Experience from "@/app/experience";
import { setDisplay } from "./ui";

export default class Router {
    constructor(private experience: Experience) {}

    public navigate(route: string) {
        document.body.classList.remove('profile_active', 'map_active')
        switch (route) {
            case "home":
                this.experience.world.terminal.showFullScreen()
                setDisplay("map_container", "none")
                setDisplay("profile_container", "none")
                break
            case "projects": 
                this.experience.world.terminal.minimizeScreen()
                document.body.classList.add('map_active')

                setDisplay("map_container", "flex")
                setDisplay("profile_container", "none")

                this.experience.setScene("map")

                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'))

                    this.experience.camera.enableControls(true)
                }, 100)
                break
            case "profil": 
                this.experience.world.terminal.minimizeScreen()
                document.body.classList.add('profile_active')
                setDisplay("terminal_container", "block")
                setDisplay("profile_container", "flex")
                setDisplay("map_container", "none")

                if (!this.experience.profileScene) {
                    this.experience.setScene("profile")
                    this.experience.camera.enableControls(false)
                }

                break
        }

        history.pushState({ page: route }, "", `#${route}`)
    }
}