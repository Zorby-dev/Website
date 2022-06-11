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

export class Shell {
    shell: Element
    history: Field
    input: Field

    user: string = "guest"
    cwd: string = "~"

    constructor() {
        this.shell = document.getElementById("shell")!;
        this.history = new Field(document.getElementById("history")!);
        this.input = new Field(document.getElementById("input")!);
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

    handleCommand(command: string) {
        
    }
}