const Logger=(type,message,info)=>{
console.log("\n==================================================================")
console.log(` ${type.toString().toUpperCase()} ----> ${message}`)
info && console.log(` INFO    ----> `,info)
console.log("==================================================================\n")
}

Logger('success','/get/id','golden')

module.exports = {Logger}