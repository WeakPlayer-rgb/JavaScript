let memory = new Array(300);
let cmd = ["put", "mul", "dec", "cmp", "jg","jl", "je", "jne", "jle", "jge","prt", "ext","j","mod","pls","cml", "mns","div", "inc","rd"];
let arrayJump = ["jg","jl","je","jne","jle","jge"];
let flags = [];
const fs = require('fs');
let tmpProgram = fs.readFileSync(process.argv[2],'utf-8');
s = tmpProgram.toString();
program = s.split(/[\n\r]/).filter(item => item !== "").join(" ").split(" ");

let prevJump = false;
let i;
for (i = 0; i<program.length; i++){
    if (arrayJump.indexOf(program[i])>=0){
        prevJump = true;
        continue;
    }
    if (program[i].indexOf("@")>=0 && !(prevJump)){
        let a = {flag:cmd.length , line:i}
        flags.push(a)
        cmd.push(program[i])
    }
    prevJump = false
}

// for (i=0;i<flags.length;i++){
//     console.log(flags[i])
// }

for(i=0; i<program.length; i++){
    memory[i] = cmd.includes(program[i]) ? parseInt(cmd.indexOf(program[i])) : parseInt(program[i]);
}

// for (i = 0; i<memory.length; i++){
//     console.log(memory[i]);
// }

let ip = 0;

// for (i=0;i<flags.length;i++){
//     console.log(flags[i].line)
// }
let ri = 3
let keepWork = true
while(keepWork){
    // console.log(cmd[memory[ip]])
    switch (memory[ip]){
        case 0:{    // put
            memory[memory[(ip+2)]] = memory[(ip+1)];
            ip+=3
            break
        }
        case 1:{    //mul
            memory[memory[(ip+3)]] = memory[memory[(ip+2)]] * memory[memory[(ip+1)]]
            ip+=4
            break
        }
        case 2:{    //dec
            memory[memory[(ip+1)]]--;
            ip+=2
            break
        }
        case 3:{    //cmp
            if (memory[memory[(ip+1)]] < memory[ip+2]) memory[270] = 0;
            else if (memory[memory[(ip+1)]] === memory[ip+2]) memory[270] = 1;
            else memory[270] = 2;
            ip += 3;
            break// 0 - less, 1 - equal, 2 - great;
        }
        case 4:{    //jg
            if (memory[270] === 2){
                let jump = flags.findIndex(item => item.flag === memory[ip+1])
                ip = flags[jump].line+1;
            }
            else ip+=2;
            break
        }
        case 5:{    //jl
            if (memory[270] === 0){
                let jump = flags.findIndex(item => item.flag === memory[ip+1])
                ip = flags[jump].line+1;
            }
            else ip+=2;
            break
        }
        case 6:{    //je
            if (memory[270] === 1){
                let jump = flags.findIndex(item => item.flag === memory[ip+1])
                ip = flags[jump].line+1;
            }
            else ip+=2;
            break
        }
        case 7:{    //jne
            if (memory[270] !== 1){
                let jump = flags.findIndex(item => item.flag === memory[ip+1])
                ip = flags[jump].line+1;
            }
            else ip+=2;
            break
        }
        case 8:{    //jle
            if (memory[270] !== 2){
                let jump = flags.findIndex(item => item.flag === memory[ip+1])
                ip = flags[jump].line+1;
            }
            else ip+=2;
            break
        }
        case 9:{    //jge
            if (memory[270] !== 0){
                let jump = flags.findIndex(item => item.flag === memory[ip+1])
                ip = flags[jump].line+1;
            }
            else ip+=2;
            break
        }
        case 10:{   //prt
            console.log(memory[memory[ip+1]])
            ip += 2;
            break
        }
        case 11:{   //ext
            if (memory[ip+1] !== 0)
                console.log(memory[ip+1])
            keepWork = false
            break
        }
        case 12:{   //jump
            let jump = flags.findIndex(item => item.flag === memory[ip+1])
            ip = flags[jump].line+1;
            break
        }
        case 13:{   //mod
            memory[memory[ip+3]] = memory[memory[ip+1]] % memory[memory[ip+2]]
            ip+=4
            break
        }
        case 14:{   //pls
            memory[memory[ip+3]] = memory[memory[ip+1]] + memory[memory[ip+2]]
            ip+=4
            break
        }
        case 15:{   //cml
            if (memory[memory[(ip+1)]] < memory[memory[ip+2]]) memory[270] = 0;
            else if (memory[memory[(ip+1)]] === memory[memory[ip+2]]) memory[270] = 1;
            else memory[270] = 2;
            ip += 3;
            break
        }
        case 16:{   //mns
            memory[memory[ip+3]] = memory[memory[ip+1]] - memory[memory[ip+2]]
            ip+=4
            break
        }
        case 17:{   //div
            memory[memory[ip+3]] = Math.floor(memory[memory[ip+1]] / memory[memory[ip+2]])
            ip+=4
            break
        }
        case 18:{   //inc
            memory[memory[(ip+1)]]++;
            ip+=2
            break
        }
        case 19:{
            memory[memory[(ip+1)]] = parseInt(process.argv[ri]);
            ri+=1
            ip+=2
            break
        }
        default:{
            ip++;
            break
        }
    }
    ip%=255;
}