
class _Tape {
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

class _BrainfuckInterpreter {
    tape: _Tape
    constructor() {
        this.tape = new _Tape()
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
                    this.tape.set(callbackInput())
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
                default:
                    break;
            }
        }
    }
    interpretSync(code: string, input: number[] | string): number[] {
        let returnArray: number[] = []
        let numberInput: number[]
        let numberInputPos: number = 0
        if (typeof input == "string") {
            numberInput = []
            for (let i: number = 0; i < input.length; i++) {
                numberInput.push(input.charCodeAt(i))
            }
        } else {
            numberInput = input
        }
        this.interpret(code, function () {
            return numberInput[numberInputPos++]
        }, function (i: number) {
            returnArray.push(i)
        })
        return returnArray
    }
    interpretSyncReturnAscii(code: string, input: number[] | string): string {
        let out = this.interpretSync(code, input)
        let outStr = ""
        out.forEach(function (item: number) {
            outStr += String.fromCharCode(item)
        })
        return outStr
    }
}

export const BrainfuckInterpreter = _BrainfuckInterpreter
export const Tape = _Tape
