# brnfck
Brainfuck interpreter and CLI written in TypeScript. It interprets vanilla Brainfuck, no fancy stuff!

How to install:
```bash

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

## Let's talk about speed
This interpreter is really just a interpreter, no JIT compilation or anything. Because of that it will take e.g. ~1430 seconds for [Mandelbrot](http://esoteric.sange.fi/brainfuck/bf-source/prog/mandelbrot.b) while other implementations only need about 100 seconds for this (tested on my machine).

## Todo for the next releases
- JIT Compiler
- Speed optimizations