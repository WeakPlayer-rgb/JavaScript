"use strict"
let escEncode = function (array) {
    let encodeArray = []
    let count = 1
    let element = array[0]
    for(let i = 1; i<array.length;i++){
        if(array[i] === element){
            count++
            if (count === 259 && element !== 35){
                encodeArray.push(35,count-4,element)
                count = 0
            }
            else if(element === 35 && count===256){
                encodeArray.push(35,count-1,element)
                count = 0
            }
            continue
        }

        if(count >= 4 && element !== 35){
            encodeArray.push(35,count-4,element)
        }
        else if( element === 35){
            encodeArray.push(35,count-1,35)
        }
        else {
            for(let j = 0;j<count;j++) {
                encodeArray.push(element)
            }
        }
        element = array[i]
        count = 1
    }
    if(count >= 4 && element !== 35){
        encodeArray.push(35,count-4,element)
    }
    else if( element === 35 && count>0){
        encodeArray.push(35,count-1,35)
    }
    else {
        for(let j = 0;j<count;j++) {
            encodeArray.push(element)
        }
    }
    return encodeArray
}

let escDecode = function (array){
    let outArray= []
    let i = 0
    while (i<array.length){
        if(array[i] === 35){
            if(array[i+2] !== 35) {
                for (let j = 0; j < array[i + 1]+4; j++) {
                    outArray.push(array[i + 2])
                }
            }
            else{
                for(let j=0;j<array[i+1]+1;j++){
                    outArray.push(35)
                }
            }
            i+=3
            continue
        }
        outArray.push(array[i])
        i++
    }

    return outArray
}

let jumpEncode = function (array){
    let outArray = []
    let repeat = array[0]
    let countRepeat
    let unrepeated
    if(array[0] === array[1] && array[1]=== array[2]){
        unrepeated = []
        repeat = array[0]
        countRepeat = 3
    }
    else{
        countRepeat = 1
        unrepeated = [array[0]]
    }

    for(let i = countRepeat; i<array.length;i++){
        if (unrepeated.length > 0) {
            unrepeated.push(array[i])
            if (unrepeated[unrepeated.length - 1] === unrepeated[unrepeated.length - 2] &&
                unrepeated[unrepeated.length - 2] === unrepeated[unrepeated.length - 3]) {
                if (unrepeated.length > 3) {
                    outArray.push(unrepeated.length - 4);
                    for(let j = 0;j<unrepeated.length-3;j++){
                        outArray.push(unrepeated[j])
                    }
                }
                repeat = array[i]
                countRepeat = 3
                unrepeated = []
                continue
            } else if (unrepeated.length >= 129) {
                outArray.push(127)
                for (let j = 0;j<unrepeated.length-1;j++){
                    outArray.push(unrepeated[j])
                }
                unrepeated = [unrepeated[128]]
            }
        }
        else{
            if(array[i] !== repeat){
                outArray.push(countRepeat+125,repeat)
                unrepeated = [array[i]]
                countRepeat = 0
                continue
            }
            else if(countRepeat + 125 === 254){
                outArray.push(254,repeat)
                unrepeated = [repeat]
                countRepeat = 0
            }
            countRepeat++
        }
    }
    if (countRepeat >2){
        outArray.push(countRepeat+125,repeat)
    }
    if(unrepeated.length-1>=0 && unrepeated.length<129) {
        outArray.push(unrepeated.length - 1)
        outArray = outArray.concat(unrepeated)
    }
    return outArray
}

let jumpDecode = function(array){
    let outArray = []
    let i = 0
    while(i<array.length){
        if(array[i]<=127){
            let j
            for(j = 0;j<array[i]+1;j++){
                outArray.push(array[i+j+1])
            }
            i+=j+1
        }
        else{
            for (let j = 0;j<array[i]-125;j++){
                outArray.push(array[i+1])
            }
            i+=2
        }
    }
    return outArray
}

const fs = require('fs')
if(process.argv.length < 3){
    console.log("Для того чтобы узнать как запустить программу пропишите\n" +
        "node rleAll.js -h")
}
else if (process.argv[2] === "-h"){
    console.log("node rleAll.js --[esc,jump] -[e,d] [input file] [output file]\n" +
        "Первым аргументом при вызове программы указывает необходимая кодировка\n" +
        "Вторым аргументом указываем что мы хотим сделать с файлом: -е - закодировать, -d - декодировать.\n"+
        "Третьим и четвёртым аргументом передаём файл который хотим закодировать и куда записать закодированный файл соответственно")
}
else {
    let file = fs.readFileSync(process.argv[4])

    if (process.argv[2] === "--esc" && process.argv[3] === "-e") {
        let array = escEncode(file)
        fs.writeFileSync(process.argv[5], Buffer.from(array))
    } else if (process.argv[2] === "--esc" && process.argv[3] === "-d") {
        let array = escDecode(file)
        fs.writeFileSync(process.argv[5], Buffer.from(array))
    } else if (process.argv[2] === "--jump" && process.argv[3] === "-e") {
        let array = jumpEncode(file)
        fs.writeFileSync(process.argv[5], Buffer.from(array))
    } else if (process.argv[2] === "--jump" && process.argv[3] === "-d") {
        let array = jumpDecode(file)
        fs.writeFileSync(process.argv[5], Buffer.from(array))
    }
    else {
        console.log("Указаны неверные аргументы")
    }
}