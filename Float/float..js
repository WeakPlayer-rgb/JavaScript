function decToFloat(num) {
    let number = Number(num)
    let binary;
    if (num === Infinity) {
        binary = "01111111100000000000000000000000"
    } else if (num === -Infinity) {
        binary = "11111111100000000000000000000000"
    } else if (isNaN(num)) {
        binary = "01111111100000000000000000000001"
    } else if (5 / num === -Infinity) {
        binary = "10000000000000000000000000000000"
    } else if (5 / num === Infinity) {
        binary = "00000000000000000000000000000000"
    } else {
        binary = GetFloat(number)
    }
    let f = parseInt("1111" + binary, 2).toString(16)
    return f.slice(1)
}

function floatToDec(num) {
    num = addTo32(parseInt(num, 16).toString(2))
    if (num.startsWith("111111111") || num.startsWith("011111111")) {
        if (num.endsWith("00000000000000000000000") && num[0] === "1")
            return -Infinity
        else if (num.endsWith("00000000000000000000000") && num[0] === "0")
            return Infinity
        else
            return NaN
    } else if (num === "00000000000000000000000000000000") {
        return 0
    } else if (num === "10000000000000000000000000000000") {
        return -0
    }
    return Translate(num)
}

function Translate(num) {
    let sign = num[0] === "0" ? 1 : -1
    let extent = parseInt(num.slice(1, 9), 2) - 127
    let mantissa = num.slice(9)
    if (extent >= 0) {
        let number = '1'
        for (let i = 0; i < extent; i++) {
            let x = parseInt(mantissa[i]).toString()
            if (isNaN(x)) x = 0
            number += x.toString()
        }
        number += '.'
        for (let i = extent; i < mantissa.length; i++) {
            number += mantissa[i]
        }
        return MakeNumber(number) * sign
    } else if (extent === -127) {
        return MakeNumber("0." + mantissa) * (2 ** (extent + 1)) * sign
    } else {
        return MakeNumber("1." + mantissa) * (2 ** extent) * sign
    }
}

function MakeNumber(num) {
    let k = num.split('.')
    let i = k[0].length - 1
    num = k.join('')
    let j = 0
    let ans = 0
    while (i > -k[1].length) {
        ans += (2 ** i) * parseInt(num[j])
        i--
        j++
    }
    return ans
}

function GetFloat(number) {
    let binary = number.toString(2).split('.')
    let sign = number < 0 ? "1" : "0";
    let firstPart = binary[0]
    let secondPart = binary[1]
    let extent
    if (firstPart.length === 1 && firstPart === '0') {
        let a = secondPart.indexOf('1') + 1
        extent = (127 - a)
    } else if (sign === "0") {
        extent = (127 + firstPart.length - 1)
    } else {
        extent = 126 + firstPart.length - 1
    }
    if(extent > 255){
        return sign + "1111111100000000000000000000000"
    }
    let mantissa = binary.join('')
    if (extent <= 0) {
        mantissa = mantissa.slice(mantissa.indexOf('1') + extent - 1)
        extent = 0
    } else {
        mantissa = mantissa.slice(mantissa.indexOf("1"))
    }
    if (mantissa.length > 23) {
        if (mantissa[24] === "1") {
            mantissa = mantissa.slice(0, 24)
            mantissa = RoundIt(mantissa)
            if (mantissa.length > 24) {
                extent += 1
                mantissa = mantissa.slice(0, 23)
            }
        } else {
            mantissa = mantissa.slice(0, 24)
        }
    } else if (mantissa.length <= 23) {
        while (mantissa.length <= 23) {
            mantissa += "0"
        }
    }
    mantissa = mantissa.slice(1, 25)
    let f = sign + addTo8(extent.toString(2)) + mantissa
    return sign + addTo8(extent.toString(2)) + mantissa
}

function addTo8(str) {
    while (str.length < 8) str = '0' + str
    return str
}

function addTo32(str) {
    while (str.length < 32) str = '0' + str
    return str
}

function RoundIt(mantissa) {
    let i = 23
    let newStr = ""
    while (mantissa[i] !== '0') {
        newStr = '0' + newStr
        i--
    }
    if (i === -1) {
        newStr = "1" + newStr
        return newStr
    } else {
        newStr = '1' + newStr
        i--
        while (i !== -1) {
            newStr = mantissa[i] + newStr
            i--
        }
    }
    return newStr
}

function Add(num1, num2) {
    let number1 = parseInt(num1, 16).toString(2)
    let number2 = parseInt(num2, 16).toString(2)
    
    let sign1 = number1[0]
    let extent1 = parseInt(number1.slice(1, 9), 2) - 127
    let mantissa1 = number1.slice(9)
    
    let sign2 = number2[0]
    let extent2 = parseInt(number2.slice(1, 9), 2) - 127
    let mantissa2 = number2.slice(9)
    
    if (sign1 === sign2) {
            
    }
}

function AddBinary(number1, number2) {
    let result = ""
    let bool = false
    let k = number1.length - number2.length
    for (let i = number1.length - 1; i > -1; i--) {
        if(number1[i] === '.') {
            result = '.' + result
            continue
        }
        result = ((parseInt(number1[i]) + parseInt(number2[i - k] === undefined ? 0 : number2[i - k]) + bool) % 2).toString() + result
        bool = (parseInt(number1[i]) + parseInt(number2[i - k] === undefined ? 0 : number2[i - k]) + bool) > 1
    }
    if (bool) result = '1' + result
    return result
}

function SubBinary(num1,num2){
    let ans = ''
    let bool = false
    let k = num1.length - num2.length
    for(let i = num1.length-1;i>-1;i--){
        if(num1[i] === '.'){
            ans = '.' + ans
            continue
        }
        ans = (RightRemains(parseInt(num1[i]) - parseInt(num2[i-k] === undefined ? 0 : num2[i-k]) - bool,2)).toString() + ans
        bool = parseInt(num1[i]) - parseInt(num2[i-k] === undefined ? 0 : num2[i-k]) - bool < 0
    }
    return ans
}

function RightRemains(num1,num2){
    let k = num1%2
    if(k<0) k+=num2
    return k
}

console.log(SubBinary('111','111'))

if (process.argv[2] === "--df") {
    console.log(decToFloat(process.argv[3]))
}
if (process.argv[2] === "--fd") {
    console.log(floatToDec(process.argv[3].slice(2)))
}
console.log(decToFloat(3.4028235E+38))