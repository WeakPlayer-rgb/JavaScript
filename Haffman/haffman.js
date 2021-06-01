class node {
    name;
    freq;
    code;
    left;
    right

    constructor(n, f, c, l, r) {
        this.name = n
        this.freq = f
        this.code = c
        this.left = l
        this.right = r
    }
}

function encode() {
    const fs = require('fs')
    let file = fs.readFileSync(process.argv[3])

    let frequency = []
    for (let i = 0; i < file.length; i++) {
        if (frequency[file[i]] !== undefined)
            frequency[file[i]]++;
        else {
            frequency[file[i]] = 1
        }
    }
    let bolt = 0
    while (frequency[bolt] !== undefined) bolt++
    frequency[bolt] = 0.5

    let tree = []
    console.log(frequency)
    for (let n in frequency) tree.push(new node([n], frequency[n], "", null, null))

    while (tree.length !== 1) {
        tree.sort((x, y) => x.freq - y.freq)
        if (tree[0].name.indexOf("34") !== -1) {
            let k = tree[0]
            tree[0] = tree[1]
            tree[1] = k
        }
        tree.push(new node(
            tree[0].name.concat(tree[1].name),
            tree[0].freq + tree[1].freq,
            "",
            tree[0],
            tree[1]
        ))
        tree = tree.slice(2)
    }

    let dictionary = {}
    while (tree.length !== 0) {
        let nodeL = tree[0].left
        let nodeR = tree[0].right
        if (nodeR !== null) {
            nodeL.code = tree[0].code + "1"
            nodeR.code = tree[0].code + "0"
            tree = [nodeL].concat([nodeR].concat(tree.slice(1)))
        } else {
            dictionary[tree[0].name] = tree[0].code
            tree = tree.slice(1)
        }
    }

    let outDictionary = ""
    for (let i in dictionary) {
        if (i !== bolt.toString())
            outDictionary += i + " - " + dictionary[i] + " " + dictionary[i].length.toString() + "\n"
    }

    fs.writeFileSync("coding", Buffer.from(outDictionary))

//console.log(dictionary)
    fs.writeFileSync(process.argv[4], "", "utf-8")

    let s = ""
    let array = []
    for (let i = 0; i < file.length; i++) {
        s += dictionary[file[i]]
        while (s.length >= 4) {
            array.push(s.slice(0, 4))
            s = s.slice(4)
        }
    }

    while (s.length !== 16) {
        s += "0"
    }
    array.push(s)
    let out = ""
    for (let i = 0; i < array.length; i++) {
        out += convertNumber(array[i], 2, 16)
    }
    fs.writeFileSync(process.argv[4], out, 'utf-8')
}

function convertNumber(n, fromBase, toBase) {
    return parseInt(n.toString(), fromBase).toString(toBase);
}

function AddTo4(str) {
    while (str.length < 4) {
        str = "0" + str
    }
    return str
}

function decode() {
    const fs = require('fs')

    let dic = fs.readFileSync("coding", 'utf-8')

    dic = dic.split(/[\n\r]/)
    dic = dic.slice(0, dic.length - 1)

    let min = Infinity
    let max = 0
    let dictionary = {}
    for (let i = 0; i < dic.length; i++) {
        let str = dic[i].split(' ')
        if (str[2].length < min) min = str[2].length
        if (max < str[2].length) max = str[2].length
        dictionary[str[2].toString()] = parseInt(str[0])
    }
    max++
    let file = fs.readFileSync(process.argv[3], 'utf-8')

    let bolt = ""
    for (let i = 0; i < max; i++) bolt += "0"

    let s = ""
    let str = ""
    let k = 0
    let out = []
    while (k < file.length) {
        if (str === "") {
            str += AddTo4(convertNumber(file[k], 16, 2))
            k++
        }
        s += str[0]
        str = str.slice(1, str.length)
        if (s === bolt) {
            break
        }
        if (dictionary[s] === undefined && s.length >= min) {
            if (dictionary[s.slice(0, s.length - 1)] === undefined) continue
            out.push(dictionary[s.slice(0, s.length - 1)])
            s = s[s.length - 1]
        }
    }

    fs.writeFileSync(process.argv[4], Buffer.from(out))
}
if(process.argv[2] === undefined){
    console.log("Wrong command. Type node haffman.js -h for help")
}
else if(process.argv[2] === "-d"){
    decode()
}
else if(process.argv[2] === "-e"){
    encode()
}
else if(process.argv[2] === "-h"){
    console.log("Type -e for encode. Type -d for decode.")
}
else{
    console.log("Wrong options")
}
