import { Shell } from "./shell";

var shell: Shell;

function prompt(): string {
    return`<span class="green">${shell.user}@zorby.tk</span>:<span class="blue">${shell.cwd}</span>$&nbsp;`;
}

window.addEventListener("load", () => {
    shell = new Shell();
    shell.print(prompt());
})

document.addEventListener("keydown", (event) => {
    switch (event.code) {
    case "Enter":
        event.preventDefault();
        shell.println(shell.input.get());
        shell.handleCommand(shell.input.get());
        shell.clearInput();
        shell.print(prompt());
        shell.scrollBottom();
        break;
    case "Home":
        event.preventDefault();
        shell.scrollBottom();
        break;
    case "ArrowUp":
        event.preventDefault();
        if (event.altKey) {
            shell.shell.scrollBy(0, -100);
        }
        break;
    case "ArrowDown":
        event.preventDefault();
        if (event.altKey) {
            shell.shell.scrollBy(0, 100);
        }
        break;
    default:
        console.log(event.code);
        break;
    }
});