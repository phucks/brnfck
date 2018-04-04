#!/usr/bin/env node

import { Command } from "commander"
import { readFileSync } from "fs"
import { BrainfuckInterpreter, numberArrayToAsciiString } from "./interpreter"

let program: Command = new Command()
if (process.env.npm_package_version) program.version(process.env.npm_package_version)
program.usage("[options] <file>")
program.option("-d, --debug", "Debugging mode shows the tape, the output in ASCII and the output in decimal. With debug mode, the all output will be written to a buffer, which will be printed after execution, so no live output.")
program.option("-i, --input [input]", "Input as ASCII string, if the program needs more input than there is given, it will receive 0")
program.option("-e, --evaluate [string]", "Interpret string")
program.option("-t, --show-time", "Shows the time, the program took to run, after execution.")
program.parse(process.argv)

let code: string = ""
if (program.evaluate != undefined) { // Evaluate string
    code = program.evaluate
} else if (program.args.length == 1) { // Evaluate file
    let file: string = program.args[0]
    code = readFileSync(file).toString()
} else {
    program.outputHelp()
    process.exit(1)
}

let interpreter: BrainfuckInterpreter = new BrainfuckInterpreter()
let startTime: number = new Date().getTime()
if (program.debug) {
    let out: number[] = interpreter.interpretSync(code, program.input)
    console.log("Tape:", interpreter.tapeAsArray())
    console.log("Output ASCII: ", numberArrayToAsciiString(out))
    console.log("Output decimal:", out)
} else {
    interpreter.interpret(code, () => {
        return 0
    }, (out: number) => {
        process.stdout.write(String.fromCharCode(out))
    })
}
if (program.showTime) {
    let endTime: number = new Date().getTime()
    console.log("\nFinished after %d seconds!", (endTime-startTime)/1000)
}