const getProbablity = (A,B) => {
    const expo = 1.0*(A.Rating-B.Rating)/Math.sqrt((A.Volatility*A.Volatility)+(B.Volatility*B.Volatility))
    // console.log(Math.sqrt((A.Volatility*A.Volatility)+(B.Volatility*B.Volatility)))
    const denom= 1.0+Math.pow(4,expo)
    return 1.0/denom
}
const getExpectedRank = (A,List) => {
    let ret=0.0
    List.forEach(element => {
        if(element.RollNumber != A.RollNumber)
        {
            ret+=getProbablity(A,element)
        }
    });
    return ret
}
const getExpectedPerformance = (N,ER) => {
    return Math.log10(N/ER-1) / Math.log10(4)
}
const getCF = (List) => {
    const N = List.length
    let V_2 = 0.0
    let Rtot = 0
    List.forEach(element => {
        V_2 += (element.Volatility * element.Volatility)
        Rtot += (element.Rating)
    });
    const Ravg = (Rtot/N)
    let R=0.0
    List.forEach(element => {
        R += ((element.Rating-Ravg) * (element.Rating-Ravg))
    });
    console.log(R)
    console.log(V_2)
    R /= (N-1)
    V_2 /= N
    return Math.sqrt(R+ V_2)
}
const update = (prevRating,Ranklist) =>{
    List = []
    const N = prevRating.length
    let r=1
    const cf = getCF(prevRating)
    console.log(cf)
    prevRating.forEach(element => {
        const rwa = ((0.4 * element.TimesPlayed + 0.2)/(0.7 * element.TimesPlayed + 0.6))
        const vwa = ((0.5 * element.TimesPlayed + 0.8)/(element.TimesPlayed + 0.6))
        List.push({TimesPlayed : (element.TimesPlayed + 1) , Rating : element.Rating , RollNumber : element.RollNumber , Volatility : element.Volatility ,ExpectedPerformance : getExpectedPerformance(N,getExpectedRank(element,prevRating)),ActualPerformance : (Math.log10(N/r-1) / Math.log10(4)),RatingWeight : rwa,VolatilityWeight : vwa})
        r+=1
    });
    console.log(List)
    List.forEach(element => {
        const new_rating = element.Rating + (element.ActualPerformance - element.ExpectedPerformance) * cf * element.RatingWeight
        const num = element.VolatilityWeight * (new_rating - element.Rating) * (new_rating - element.Rating) + element.Volatility* element.Volatility
        const denom = element.VolatilityWeight + 1.1
        const new_volatility = Math.sqrt(num/denom)
        element.Rating = new_rating
        element.Volatility = new_volatility
    });
    ret = []
    List.forEach(element => {
        ret.push({ RollNumber: element.RollNumber, Rating: element.Rating, Volatility: element.Volatility, TimesPlayed: element.TimesPlayed })
    });
    return ret
}

module.exports = {
    update : update
}