const add = require('./foolib')

console.log(add.addTwoNumbersSync(2,3))

add.addTwoNumbersAsync(3,2,function(err,result) {
    console.log(result)
    
})