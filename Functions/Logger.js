
const Logger=(type,message,info)=>{
// const success = 
console.log("\n==================================================================")
console.log(` \x1b[32m${type.toString().toUpperCase()}\x1b[0m ----> ${message}`)
info && console.log(` INFO    ----> `,info)
console.log("==================================================================\n")
}

module.exports = {Logger}