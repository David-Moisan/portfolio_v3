import Experience from "@/app/experience"

type TerminalCommand = (args?: string[]) => void

export default class Terminal {
    private experience!: Experience
    private container!: HTMLElement
    private output!: HTMLElement
    private input!: HTMLInputElement
    private commands!: Record<string, TerminalCommand>

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
            projects: () => experience.router.navigate("projects"),
            profil: () => experience.router.navigate("profil"),
            home: () => experience.router.navigate("home")
        }

        this.setupInput()
    }

    private setupInput() {
        this.input.focus()

        this.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const command = this.input.value.trim()
                this.input.value = ""
                if (command) this.execute(command)
            }
        })
    }

    private execute(rawInput: string) {
        this.logCommand(rawInput)

        const [cmd, ...args] = rawInput.split(" ")
        const commandFunc = this.commands[cmd]

        if (commandFunc) {
            commandFunc(args)
        } else {
            this.printLine(`Unknown command : "${cmd}". Type "help" to see the valid commands.`)
        }
    }

    private logCommand(command: string) {
        const el = document.createElement("p")
        el.classList.add("command")
        el.innerHTML = `<span class="prompt">$</span> ${command}`
        this.output.appendChild(el)
    }

    private printLine(text: string) {
        const el = document.createElement("p")
        el.innerText = text
        this.output.appendChild(el)
    }

    private clear() {
        this.output.innerHTML = `<p>Type <strong>"help"</strong> to see the commands.</p>`
    }

    private printHelp() {
        this.printLine("📖 List of commands :")
        Object.entries(this.commands).forEach(([cmd]) => {
            this.printLine(`- ${cmd}`)
        })
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