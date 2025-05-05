import Experience from "../app/experience"
import { wait } from "../utils/ui"
import AudioManager from "../utils/audioManager"
import SFXManager from "../utils/sfxManager"

type TerminalCommand = (args?: string[]) => void

export default class Terminal {
    private container!: HTMLElement
    private output!: HTMLElement
    private input!: HTMLInputElement
    private commands!: Record<string, TerminalCommand>
    private history: string[] = []
    private historyIndex: number = -1
    private hasBootedProjects: boolean = false
    private hasBootedProfile: boolean = false

    constructor(experience: Experience) {
        this.createDOMStructure()
        this.setupCommands(experience)
        this.setupInput()
    }

    private createDOMStructure() {
        // Main container
        this.container = document.createElement("section")
        this.container.className = "terminal_container"

        // Terminal Block
        const terminal = document.createElement("div")
        terminal.id = "terminal"

        // Output area
        this.output = document.createElement("div")
        this.output.id = "terminal-output"
        this.output.innerHTML = `
            <p class="terminal-output_header">
                Type <strong>"help"</strong> to see the commands.
            </p>
        `

        terminal.appendChild(this.output)

        // Input line
        const inputLine = document.createElement("div")
        inputLine.className = "input-line"

        const prompt = document.createElement("span")
        prompt.className = "prompt"
        prompt.textContent = "agent@blackcell:~$"

        this.input = document.createElement("input")
        this.input.type = "text"
        this.input.id = "input"
        this.input.autofocus = true

        inputLine.appendChild(prompt)
        inputLine.appendChild(this.input)

        terminal.appendChild(inputLine)

        // Scanline overlay
        const overlay = document.createElement("div")
        overlay.className = "scanlines-overlay"

        this.container.appendChild(terminal)
        this.container.appendChild(overlay)

        // Append to DOM
        document.body.appendChild(this.container)
    }

    private setupCommands(experience: Experience) {
        this.commands = {
            help: this.printHelp.bind(this),
            projects: async () => {
                if (!this.hasBootedProjects) {
                    await this.simulateBootProcess()
                    await this.simulateStreamingLogs()
                    this.hasBootedProjects = true
                }

                experience.router.navigate("projects")
            },
            profile: async () => {
                if (!this.hasBootedProfile) {
                    await this.simulateBootProfileProcess()
                    this.hasBootedProfile = true
                }

                experience.router.navigate("profile")
            },
            home: () => experience.router.navigate("home"),
            clear: this.clear.bind(this),
            ls: () => this.printLine("home/ projects/ profile/ about.txt"),
            cd: (args = []) => {
                const target = args[0]
                if (!target) return this.printLine("cd: Missing argument")
                if (["projects", "profile", "home"].includes(target)) {
                    this.printLine(`📂 Changing directory to ${target}/`)
                } else {
                    this.printLine(`cd: no such file or directory: ${target}`)
                }
            },
            cat: (args = []) => {
                const file = args[0]
                if (file === 'about.txt') {
                    this.printLine("🧠 Agent phi_and_code\n🛠️ Mission : find the famous name of map in Call of Duty Black Ops 1 end with Town.")
                } else {
                    this.printLine(`cat: ${file}: No such file`)
                }
            },
            audio: (args = []) => {
                if(args[0] === 'on') {
                    AudioManager.playBackgroundMusic()
                } else {
                    AudioManager.stopBackgroundMusic()
                }
            },
            next: () => AudioManager.nextBackgroundMusic(),
            nuke: () => this.triggerNukeSequence()
        }
    }

    private setupInput() {
        this.input.focus()

        this.input.addEventListener("keydown", async (event) => {
            const ignoredKeys = ["ArrowLeft", "ArrowRight", "Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"]

            if (!ignoredKeys.includes(event.key)) {
                SFXManager.playTypeSound()
            }

            if (event.key === "Enter") {
                SFXManager.playEnterSound()
                const command = this.input.value.trim()
                if (command) {
                    this.history.push(command)
                    this.historyIndex = this.history.length
                    await this.execute(command)
                    this.input.value = ""
                } else {
                    this.logCommand("")
                }

                this.input.value = ""
            } else if (event.key === "ArrowUp") {
                if (this.historyIndex > 0) {
                    this.historyIndex--
                    this.input.value = this.history[this.historyIndex]
                }
            } else if (event.key === "ArrowDown") {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++
                    this.input.value = this.history[this.historyIndex]
                } else {
                    this.input.value = ""
                    this.historyIndex = this.history.length
                }
            } else if (event.key === "Tab") {
                event.preventDefault()
                const current = this.input.value.trim()
                const matching = Object.keys(this.commands).filter(cmd => cmd.startsWith(current))

                if (matching.length === 1) {
                    this.input.value = matching[0]
                } else if (matching.length > 1) {
                    this.printLine(`🔎 Suggestions: ${matching.join(', ')}`)
                }
            }
        })
    }

    private async execute(rawInput: string) {
        this.logCommand(rawInput)

        const [cmd, ...args] = rawInput.split(" ")
        const commandFunc = this.commands[cmd]

        if (commandFunc) {
            await commandFunc(args)
        } else {
            this.printLine(`Unknown command : "${cmd}". Type "help" to see the valid commands.`)
        }
    }

    private logCommand(command: string) {
        const el = document.createElement("p")
        el.classList.add("command")
        el.innerHTML = `<span class="prompt">agent@blackcell:~$</span> ${command}`
        this.output.appendChild(el)
    }

    private printLine(text: string) {
        const el = document.createElement("p")
        el.innerText = text
        this.output.appendChild(el)
    }

    private clear() {
        this.output.innerHTML = `<p class="terminal-output_header">Type <strong>"help"</strong> to see the commands.</p>`
    }

    private printHelp() {
        this.printLine("📖 List of commands :")
        Object.entries(this.commands).forEach(([key]) => {
            const desc = {
                clear: "🧹 Clean the terminal",
                projects: "📍 Open the interactive map",
                profile: "🕵🏻 Show agent card",
                ls: "🗃️ List directory",
                cd: "🔀 Change directory",
                cat: "📄 Read a file (mysterious)",
                home: "🏠 Come back safely",
                audio: "🔊 Active/Stop audio",
                next: "🔊 Next song of tracklist"
            }

            const description = desc[key as keyof typeof desc] || "No description"
            this.printLine(`> ${key} - ${description}`)
        })
    }

    private async simulateBootProfileProcess(): Promise<void> {
        const steps = [
            '→ Initializing face context...',
            '→ Loading profile data...',
            '→ Scan ready to analyse ✔',
        ];

        for (const step of steps) {
            await this.typeLine(step, 30)
            await wait(300)
        }
    }

    private async simulateBootProcess(): Promise<void> {
        const steps = [
            '→ Initializing map context...',
            '→ Loading terrain elevation...',
            '→ Injecting shader pipeline...',
            '→ Pulling CIA satellite data...',
        ]

        for (const step of steps) {
            await this.typeLine(step, 30)
            await wait(400)
        }
    }

    private async simulateStreamingLogs() : Promise<void> {
        const steps = [
            'Pulling CIA/data-pack-v2...',
            'Downloading [=>         ] 10%',
            'Downloading [====>      ] 35%',
            'Downloading [=======>   ] 68%',
            'Downloading [==========>] 100%',
            'Verifying package signature...',
            'Extracting modules...',
            'Initialization complete ✔',
            '→ Finalizing HUD overlay...',
            '→ Map module ready ✔'
        ]

        for (const step of steps) {
            await this.typeLine(step, 20)
            await wait(300)
        }
    }

    private async typeLine(text: string, delay: number = 50): Promise<void> {
        return new Promise((resolve) => {
            const line = document.createElement('p')
            const prompt = document.createElement('span')
            prompt.classList.add('prompt')
            prompt.textContent = 'agent@blackcell:~$ '
            line.appendChild(prompt)

            const span = document.createElement('span')
            line.appendChild(span)

            this.output.appendChild(line)

            let i = 0
            const typing = setInterval(() => {
                if (i < text.length) {
                    span.textContent += text.charAt(i)
                    i++
                    this.output.scrollTop = this.output.scrollHeight
                } else {
                    clearInterval(typing)
                    resolve()
                }
            }, delay)
        })
    }
    

    private async triggerNukeSequence(): Promise<void> {
        const glitchOverlay = document.getElementById("glitch-overlay") as HTMLElement

        if (!glitchOverlay) return
        SFXManager.playNukeSound()
        glitchOverlay.style.display = "flex"

        await wait(3800)
        this.clear()
        SFXManager.playBootAfterNukeSound()
        glitchOverlay.style.display = "none"
        this.printLine("🧠 System rebooting...IA run the world !!")
    }

    public showFullScreen() {
        this.container.style.width = "100vw"
        this.container.style.height = "100vh"
        this.container.style.position = "fixed"
    }

    public minimizeScreen() {
        this.container.style.width = "30vw"
        this.container.style.height = "100vh"
        this.container.style.position = "absolute"
        this.container.style.top = "0"
        this.container.style.left = "0"
    }
}