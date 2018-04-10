# brnfck
Brainfuck interpreter and CLI written in TypeScript. It interprets vanilla Brainfuck, no fancy stuff!

## How to install:
```bash
npm install https://github.com/tobiasholler/brnfck.git
```

## How to use it
```bash
brnfck file.bf
```
With input
```bash
brnfck file.bf -i "HELLO"
```
Debug mode for more output
```bash
brnfck file.bf -i "HELLO" -d
```
For everything else, `--help` is your friend
```bash
brnfck --help
```

## Under the hood
This interpreter is compiles the Brainfuck code to JavaScript which will then be run using the `eval` function. At the beginning of this project the code was run with a old style interpreter, it took ~1430 seconds to run [Mandelbrot](http://esoteric.sange.fi/brainfuck/bf-source/prog/mandelbrot.b) now with the compiler it only takes ~60 seconds (tested on my machine).

## Todo for the next releases
- Read Files to input
- Input during execution
- Update code to make it less confusing and more organized
- Video Driver, so you can program Games in Brainfuck