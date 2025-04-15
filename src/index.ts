import Experience from './app/experience'
import './style.css'
import '../gsap-config'

const showLoaderDuration = 3000

const loadingScreen = document.querySelector('.loading_screen') as HTMLElement
const terminalScreen = document.querySelector('.terminal_container') as HTMLElement
const mapScreen = document.getElementById("map_container") as HTMLElement
const profileScreen = document.getElementById("profile_container") as HTMLElement

const terminal = document.getElementById('terminal') as HTMLElement
const inputField = document.getElementById('input') as HTMLInputElement

let experience: Experience | null = null

type RouteKey = 'home' | 'projects' | 'profil'

const COMMANDS: Record<string, string> = {
    help: 'List of commands: help, clear, projects, profile',
    clear: 'Clean the terminal',
    projects: 'Open the interactive map',
    profil: 'Show agent card'
}

function showMap() {
    if (!experience) {
        const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement | null
        if (!canvas) throw new Error("Canvas not found")
        experience = new Experience(canvas)
    }
}

const showTerminalFullScreen = (container: HTMLElement) => {

    container.style.width = '100vw'
    container.style.height = '100vh'
    container.style.position = 'fixed'
}

const minimizeTerminal = (container: HTMLElement) => {
    container.style.width = '30vw'
    container.style.height = '100vh'
    container.style.position = 'absolute'
}

const routes: Record<RouteKey, () => void> = {
    home: () => {
        showTerminalFullScreen(terminalScreen)
        mapScreen.style.display = "none"
        profileScreen.style.display = "none"
    },
    projects: () => {
        minimizeTerminal(terminalScreen)
        mapScreen.style.display = "block"
        profileScreen.style.display = "none"
        showMap()

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 50)
    },
    profil: () => {
        minimizeTerminal(terminalScreen)
        mapScreen.style.display = "none"
        profileScreen.style.display = "block"
    }
}

function navigateTo(route: string) {
    if (routes[route as RouteKey]) {
        window.history.pushState({ page: route }, "", `#${route}`)
        routes[route as RouteKey]()
    } else {
        terminal.innerHTML += `<p class="output">Commande inconnue: "${route}". Tapez "help" pour voir les commandes.</p>`
    }
}

function processCommand(command: string) {
    const terminalOutput = document.getElementById("terminal-output")

    const output = document.createElement("p")
    output.classList.add("command")
    output.innerHTML = `<span class="prompt">$</span> ${command}`
    terminal.appendChild(output)

    if (command === "help") {
        if (terminalOutput) {
            for (const cmd in COMMANDS) {
                const helpLine = document.createElement("p")
                helpLine.textContent = `$ ${cmd} - ${COMMANDS[cmd]}`
                terminalOutput.appendChild(helpLine)
            }
        }
        return
    }

    if (command === "clear") {
        if (terminalOutput) {
            terminalOutput.innerHTML = `<p>Tapez <strong>"help"</strong> pour voir les commandes.</p>`
        }
        return
    }

    navigateTo(command)
    terminal.scrollTop = terminal.scrollHeight
}

if (inputField) {
    inputField.focus()
    inputField.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault()
            const command = inputField.value.trim()
            if (command) {
                processCommand(command)
                inputField.value = ""
            }
        }
    })
}

window.addEventListener("popstate", (event) => {
    if (event.state?.page && routes[event.state.page as RouteKey]) {
        routes[event.state.page as RouteKey]()
    }
})

window.addEventListener("DOMContentLoaded", () => {

    terminalScreen.style.display = 'none'
    mapScreen.style.display = 'none'
    profileScreen.style.display = 'none'
    loadingScreen.style.display = 'flex'
    loadingScreen.style.opacity = '1'
    loadingScreen.style.zIndex = '1000'

    setTimeout(() => {
        loadingScreen.style.opacity = '0'
        loadingScreen.style.transition = 'opacity 0.5s ease'

        setTimeout(() => {
            loadingScreen.style.display = 'none'
            terminalScreen.style.display = 'block'
            showTerminalFullScreen(terminalScreen)

            const initalHash = window.location.hash.replace('#', '') as RouteKey
            if (routes[initalHash]) {
                routes[initalHash]()
            } else {
                routes.home()
            }
        }, 500)
    }, showLoaderDuration)
})