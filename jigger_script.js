// min inclusive, max exclusive
const getRndInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRndElement = iterable => {
    return iterable[getRndInt(0, iterable.length - 1)]
}

const findConsenants = (address) => {
    let myArr = []
    const CONSENANTS = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","y","z"]
    const addr_length = address.length
    const addr_lower = address.toLowerCase()
    for (let i = 0; i < addr_length; i++) {
        if (CONSENANTS.includes(addr_lower[i])) {
            myArr.push(i)
        }
    }
    return myArr
}

Array.prototype.insert = function(index,item) {
    this.splice(index,0,item);
}

const findLastNumIndex = charList => {
    const NUMS = "0123456789".split("")
    let i = 0
    while (NUMS.includes(charList[i])) {
        i++
    }
    return i
}

const sendOutput = (jigs, outputID) => {
    jigsStr = jigs.join("\n")
    const textArea = document.querySelector(outputID)
    textArea.style.display = "inline-flex"
    textArea.value = jigsStr
}

const addressJig1 = (e) => {           
    e.preventDefault()

    // init vars
    let jigs = []
    const address = document.querySelector("#addr_line1").value
    const amount = parseInt(document.querySelector("#line1_amount").value)
    const lastNumIndex = findLastNumIndex(address.split(""))
    
    // locating consenants
    const consenants = findConsenants(address)

    // random jigging phase
    for (let i = 0; i < amount; i++) {

        const charList = address.split("")

        // doubling 2 random consenants
        const randomMax = getRndInt(1,3)
        for (let i = 0; i < randomMax; i++) {
            const ranPos = consenants[getRndInt(0, consenants.length - 1)]
            charList.insert(ranPos + 1, address[ranPos].toLowerCase())
        }

        // adding 2 fullstops at any place after the street number
        for (let i = 0; i < 2; i++) {
            const ranPos = getRndInt(lastNumIndex + 1, address.length - 1)
            charList.insert(ranPos, ".")
        }

        // adding XXX jig
        letters = "qwertyuiopasdfghjklzxcvbnm".toUpperCase().split("")
        charList.insert(0, " ")
        for (let i = 0; i < 3; i++) {
            charList.insert(0, getRndElement(letters))
        }

        // adding this jig to list of all completed jigs
        jiggedAddress = charList.join("")
        jigs.push(jiggedAddress)
    }
    sendOutput(jigs, "#line1_output")
    return false
}

const addressJig2 = e => {
    e.preventDefault()

    let jigs = []
    
    const amount = parseInt(document.querySelector("#line2_amount").value)
    const OPTIONS = ["House", "Room", "Door", "Apartment", "Button", "Ringer", "Bell", "Box"]
    const LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("")
    const NUMBERS = "123456789".split("")

    for (let i=0; i<amount; i++) {
        jigs.push(getRndElement(OPTIONS) + " " + getRndElement(LETTERS) + getRndElement(NUMBERS))
    }

    sendOutput(jigs, "#line2_output")
    return false
}

const updateFunction = input_field => {
    const line2Amount = document.querySelector("#line2_amount")
    line2Amount.value = input_field.value
}