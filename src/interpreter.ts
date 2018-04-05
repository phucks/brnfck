// _____                                _           _  
// |  __ \                              | |         | |
// | |  | | ___ _ __  _ __ ___  ___ __ _| |_ ___  __| |
// | |  | |/ _ \ '_ \| '__/ _ \/ __/ _` | __/ _ \/ _` |
// | |__| |  __/ |_) | | |  __/ (_| (_| | ||  __/ (_| |
// |_____/ \___| .__/|_|  \___|\___\__,_|\__\___|\__,_|
//             | |                                     
//             |_|                                     


// Deprecated
/*export*/ class Tape {
    index: number
    tape: number[]
    constructor() {
        this.index = 0
        this.tape = [0]
    }
    shiftLeft(): void {
        this.index--
        if (this.index < 0) this.index = 0
    }
    shiftRight(): void {
        this.index++
        if (this.tape.length - 1 < this.index) this.tape.push(0)
    }
    increase(): void {
        this.tape[this.index]++
        if (this.tape[this.index] > 255) this.tape[this.index] = 0
    }
    decrease(): void {
        this.tape[this.index]--
        if (this.tape[this.index] < 0) this.tape[this.index] = 255
    }
    get(): number {
        return this.tape[this.index]
    }
    set(i: number): void {
        if (i > 255) this.tape[this.index] = 255
        else if (i < 0) this.tape[this.index] = 0
        else this.tape[this.index] = Math.floor(i)
    }
}

//Deprecated
/*export*/ class BrainfuckInterpreter {
    tape: Tape
    constructor() {
        this.tape = new Tape()
    }
    interpret(code: string, callbackInput: () => number, callbackOutput: (output: number) => void) {
        for (let i: number = 0; i < code.length; i++) {
            switch (code.charAt(i)) {
                case ">":
                    this.tape.shiftRight()
                    break;
                case "<":
                    this.tape.shiftLeft()
                    break;
                case "+":
                    this.tape.increase()
                    break;
                case "-":
                    this.tape.decrease()
                    break;
                case ".":
                    callbackOutput(this.tape.get())
                    break;
                case ",":
                    let input = callbackInput()
                    if (typeof input != "number" || input < 0 || input > 255) throw new Error("Invalid input! Input given was: " + input)
                    this.tape.set(input)
                    break;
                case "[":
                    // detect where the loop closes
                    let openCount = 0
                    let closePos: number | undefined // the loop closes at this position
                    let codeFromHere: string = code.substr(i + 1)
                    for (var j = 0; j < codeFromHere.length; j++) {
                        if (codeFromHere.charAt(j) == "[") openCount++
                        else if (codeFromHere.charAt(j) == "]") openCount--
                        if (openCount < 0) {
                            closePos = i + j + 1
                            break
                        }
                    }
                    if (closePos == undefined) throw new Error("Error! Can't parse loops! Parentheses wrongly set!")
                    while (this.tape.get() > 0) {
                        this.interpret(code.substring(i + 1, closePos), callbackInput, callbackOutput)
                    }
                    i = closePos
                    break;
            }
        }
    }
    interpretSync(code: string, input: number[] | string | undefined = undefined): number[] {
        let returnArray: number[] = []
        let numberInput: number[]
        let numberInputPos: number = 0
        if (typeof input == "string") {
            numberInput = []
            for (let i: number = 0; i < input.length; i++) {
                numberInput.push(input.charCodeAt(i))
            }
        } else if (input == undefined) {
            numberInput = []
        } else {
            numberInput = input
        }
        this.interpret(code, function () {
            return numberInput[numberInputPos++] | 0
        }, function (i: number) {
            returnArray.push(i)
        })
        return returnArray
    }
    tapeAsArray(): number[] {
        return this.tape.tape.slice(0)
    }
}

export function numberArrayToAsciiString(arr: number[]): string {
    let str = ""
    arr.forEach(function (item: number) {
        str += String.fromCharCode(item)
    })
    return str
}