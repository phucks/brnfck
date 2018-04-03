import { BrainfuckInterpreter } from "./interpreter"
import "colors"

class BrainfuckTest {
    code: string
    input: string | number[]
    expectedOutput: string | number[] | undefined
    expectedTape: number[] | undefined
    constructor(code: string, input: string | number[], expectedOutput: string | number[] | undefined = undefined, expectedTape: number[] | undefined = undefined) {
        this.code = code
        this.input = input
        this.expectedOutput = expectedOutput
        this.expectedTape = expectedTape
    }
    test(): boolean {
        let interpreter = new BrainfuckInterpreter()
        if (this.expectedOutput == undefined) {
            interpreter.interpretSync(this.code, this.input)
        } else if (typeof this.expectedOutput == "string") {
            let out = interpreter.interpretSyncReturnAscii(this.code, this.input)
            if (out != this.expectedOutput) return false
        } else {
            let out = interpreter.interpretSync(this.code, this.input)
            // compare two arrays
            if (out.length != this.expectedOutput.length) return false
            for (let i = 0; i < out.length; i++) {
                if (out[i] != this.expectedOutput[0]) return false
            }
        }
        if (this.expectedTape == undefined) return true
        if (this.expectedTape.length != interpreter.tape.tape.length) return false
        for (let i = 0; i < this.expectedTape.length; i++) {
            if (this.expectedTape[i] != interpreter.tape.tape[i]) return false
        }
        return true
    }
}

class BrainfuckTestFail extends BrainfuckTest {
    test(): boolean {
        return !super.test()
    }
}

let tests: BrainfuckTest[] = [
    new BrainfuckTest(",-.>,-.>,-.>,-.>,-.>,-.>,-.>,-.>,-.>,-.", "IFMMPifmmp", "HELLOhello"),
    new BrainfuckTestFail(",-.>,-.>,-.>,-.>,-.>,-.>,-.>,-.>,-.>,-.", "IFMMPifmmp", "This shouldnt be the result!"),
    new BrainfuckTest("++++[->+<]", "", undefined, [0, 4]),
    new BrainfuckTest("-+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.", "", "@"),
    new BrainfuckTest("+++++++[->++++++++++<]>.", "", "F"),
    new BrainfuckTest("--[----->+<]>---.++++++++++++.+.+++++++++.+[-->+<]>+++.++[-->+++<]>.++++++++++++.+.+++++++++.-[-->+++++<]>++.[--->++<]>-.-----------.", "", "copy@copy.sh")
]
tests.forEach((test: BrainfuckTest, index: number) => {
    if (!test.test())
        throw new Error(("\nError at Brainfuck test index " + index + "!").red + "\n")
})
console.log("TESTS SUCCESSFUL!".green, "\n")