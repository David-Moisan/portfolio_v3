import Experience from "@/app/experience"
import { wait } from "../utils/ui"
import AudioManager from "../utils/audioManager"
import SFXManager from "../utils/sfxManager"

type TerminalCommand = (args?: string[]) => void

export default class Terminal {
    private experience!: Experience
    private container!: HTMLElement
    private output!: HTMLElement
    private input!: HTMLInputElement
    private commands!: Record<string, TerminalCommand>
    private history: string[] = []
    private historyIndex: number = -1

    constructor(experience: Experience) {
        this.experience = experience

        this.container = document.querySelector('.terminal_container') as HTMLElement
        this.output = document.getElementById("terminal-output") as HTMLElement
        this.input = document.getElementById("input") as HTMLInputElement

        if (!this.container || !this.output || !this.input) {
            throw new Error("Terminal elements not found")
        }

        this.commands = {
            help: this.printHelp.bind(this),
            clear: this.clear.bind(this),
            projects: async () => {
                // await this.printLoadingBar()
                await this.simulateBootProcess()
                await this.simulateStreamingLogs()
                experience.router.navigate("projects")
            },
            profil: () => experience.router.navigate("profil"),
            home: () => experience.router.navigate("home"),
            ls: () => {
                this.printLine("home/ projects/ profil/ about.txt")
            },
            cd: (args = []) => {
                if (!args.length) {
                    this.printLine("cd: Missing argument")
                    return
                }

                const path = args[0]
                if (path === 'projects' || path === 'profil' || path === 'home') {
                    this.printLine(`📂 Changing directory to ${path}/`)
                } else {
                    this.printLine(`cd: no such file or directory: ${path}`)
                }
            },
            cat: (args = []) => {
                const file = args[0]
                if (file === 'about.txt') {
                    this.printLine("🧠 Agent phi_and_code\n🛠️ Code. Design. Mission.")
                } else {
                    this.printLine(`cat: ${file}: No such file`)
                }
            },
            history: () => {
                this.history.forEach((cmd, i) => this.printLine(`${i + 1}  ${cmd}`))
            },
            audio: (args = []) => {
                const settings = args[0]

                if(settings === 'on') {
                    AudioManager.playBackgroundMusic()
                } else {
                    AudioManager.stopBackgroundMusic()
                }
            },
            next: () => AudioManager.nextBackgroundMusic(),
            nuke: () => this.triggerNukeSequence()
        }

        this.setupInput()
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
        Object.entries(this.commands).forEach(([cmd]) => {
            if (cmd === 'help') {
                this.printLine(`❓ ${cmd} : List of commands`)
            } else if (cmd === 'clear') {
                this.printLine(`🧹 ${cmd} : Clean the terminal`)
            } else if (cmd === 'projects') {
                this.printLine(`📍 ${cmd} : Open the interactive map`)
            } else if (cmd === 'profil') {
                this.printLine(`🕵🏻 ${cmd} : Show agent card`)
            } else if (cmd === 'ls') {
                this.printLine(`🗃️ ${cmd} : Show directory`)
            } else if (cmd === 'cat') {
                this.printLine(`📄 ${cmd} : Read a mysterious file`)
            } else if (cmd === 'home') {
                this.printLine(`🏠 ${cmd} : Come back safely`)
            } else if (cmd === 'cd') {
                this.printLine(`🔀 ${cmd} : Change directory`)
            } else if (cmd === 'history') {
                this.printLine(`💾 ${cmd} : List of all commands`)
            } else if (cmd === 'audio') {
                this.printLine(`🔊 ${cmd} : Active audio or stop`)
            } else if (cmd === 'next') {
                this.printLine(`🔊 ${cmd} : Next song of tracklist`)
            }
        })
    }

    private async simulateBootProcess(): Promise<void> {
        const steps = [
            '→ Initializing map context...',
            '→ Loading terrain elevation...',
            '→ Injecting shader pipeline...',
            '→ Pulling CIA satellite data...',
        ]

        for (const step of steps) {
            await this.typeLine(step, 40)
            await wait(600)
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
            await wait(400)
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