function parseString(text: string) {
    return text.replace(/\n/g, "<br>");
}

class Field {
    private element: Element

    constructor(element: Element) {
        this.element = element;
    }

    get() {
        return this.element.innerHTML;
    }

    set(value: string) {
        this.element.innerHTML = parseString(value);
    }

    push(value: string) {
        this.element.innerHTML += parseString(value);
    }

    getElement() {
        return this.element;
    }
}

class InputField extends Field {
    setCursor(position: number) {
        const element = this.getElement();
        let pos = position >= 0 ? position : element.innerHTML.length + position + 1;
        let range = document.createRange();
        let sel = window.getSelection()!;
    
        range.setStart(element.childNodes[0], pos);
        range.collapse(true);
    
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function echo(shell: Shell, text: string) {
    shell.println(text);
}

interface Command {
    (shell: Shell, text: string): void
}

export class Shell {
    static commands: {[cmdName: string]: Command} = {
        "echo": echo
    }

    shell: Element
    history: Field
    input: InputField

    user: string = "guest"
    cwd: string = "~"

    private previous: string[] = []
    private historyIndex: number = -1
    private userInput: string = ""

    constructor() {
        this.shell = document.getElementById("shell")!;
        this.history = new Field(document.getElementById("history")!);
        this.input = new InputField(document.getElementById("input")!);
    }

    print(text: string) {
        this.history.push(text);
    }

    println(text: string) {
        this.print(text + "\n");
    }

    clearHistory() {
        this.history.set("");
    }

    clearInput() {
        this.input.set("");
    }

    clear() {
        this.clearHistory();
        this.clearInput();
    }

    scrollBottom() {
        this.shell.scrollTo(0, this.shell.scrollHeight);
    }

    addToHistory(text: string) {
        if (!text || this.previous.at(0) == text) return;
        this.previous.unshift(text);
        this.historyIndex = -1;
    }

    shift() {
        if (this.historyIndex === -1) {
            this.userInput = this.input.get();
        }
        if (this.historyIndex < this.previous.length - 1) {
            this.historyIndex++;
        }
        this.input.set(this.previous.at(this.historyIndex)!);
        this.input.setCursor(-1);
    }

    unshift() {
        if (this.historyIndex === -1) {
            this.userInput = this.input.get();
        }
        if (this.historyIndex >= 0) {
            this.historyIndex--;
        }
        const val = this.historyIndex != -1 ? this.previous.at(this.historyIndex)! : this.userInput;
        this.input.set(val);
        this.input.setCursor(-1);
    }

    handleCommand(command: string) {
        const match = /(\S+)(?: |$)(.*)$/.exec(command);
        if (!match) return;
        const cmdName = match[1];
        const args = match[2];
        const cmd = Shell.commands[cmdName];
        if (!cmd) {
            this.println(`'${cmdName}' is not recognised as an internal or external command, operable program or batch file.`);
            return;
        }
        cmd(this, args);
    }
}