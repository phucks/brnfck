#!/usr/bin/env node

import { Command } from "commander"
import { readFileSync, writeFileSync } from "fs"
import { numberArrayToAsciiString } from "./interpreter"
import { compileBrainfuckToFunction, compileBrainfuckToStandalone } from "./compiler"

let program: Command = new Command()
if (process.env.npm_package_version) program.version(process.env.npm_package_version)
program.usage("[options] <file>")
program.option("-d, --debug", "Debugging mode shows the tape, the output in ASCII and the output in decimal. With debug mode, the all output will be written to a buffer, which will be printed after execution, so no live output.")
program.option("-i, --input [input]", "Input as ASCII string, if the program needs more input than there is given, it will receive 0.")
program.option("-c, --compile [file?]", "Compiles the program to a standalone JavaScript program and saves it to given file. Naming of the file is optional.")
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

if (program.compile != undefined) { // Compile to file
    let compiledCode: string = compileBrainfuckToStandalone(code)
    let fileName = program.compile
    if (program.compile == true && program.evaluate != undefined) // no name and source file given
        fileName = "brnfck-compiled.js"
    else if (program.compile == true) // no name given but source file
        fileName = program.args[0]/*.substr(0, program.args[0].lastIndexOf("."))*/ + ".js"
    writeFileSync(fileName, compiledCode, "utf8")
    console.log("Successfully compiled to '" + fileName + "'!")
} else { // Run
    let startTime: number = new Date().getTime()
    let brainfuckFunction = compileBrainfuckToFunction(code)
    if (program.debug) { // With Debug mode
        let out: number[] = []
        let c: number = 0
        let tape: Uint8Array = brainfuckFunction(() => { // read
            if (typeof program.input == "string" && c < program.input.length)
                return program.input.charCodeAt(c++)
            return 0
        }, (byte: number) => { // write
            out.push(byte)
        })
        let numberInput: number[] = []
        if (program.input != undefined) {
            for (let i: number = 0; i < program.input.length; i++) {
                numberInput.push(program.input.charCodeAt(i))
            }
        }
        let tapeLength: number = 1
        for (let i = tape.length-1; i >= 0; i--) {
            if (tape[i] != 0) {
                tapeLength = i+1
                break;
            }
        }
        tape = tape.slice(0, tapeLength)
        console.log("Tape:")
        console.log(tape.toString())
        console.log("Output ASCII:")
        console.log(numberArrayToAsciiString(out))
        console.log("Output Decimal:")
        console.log(out.toString())
    } else { // Without Debug mode
        let c: number = 0
        brainfuckFunction(() => {
            if (typeof program.input == "string" && c < program.input.length)
                return program.input.charCodeAt(c++)
            return 0
        }, (byte: number) => {
            process.stdout.write(String.fromCharCode(byte))
        })
    }
    if (program.showTime) {
        let endTime: number = new Date().getTime()
        console.log("\nFinished after %d seconds!", (endTime - startTime) / 1000)
    }
}