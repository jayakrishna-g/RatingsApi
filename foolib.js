module.exports.addTwoNumbersSync = (a,b) =>
{
    return a+b;
}

module.exports.addTwoNumbersAsync = (a,b,callback) =>
{
    callback(null , a+b);
}