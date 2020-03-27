const getProbablity = (A, B) => {
    const expo = 1.0 * (A.Rating - B.Rating) / Math.sqrt((A.Volatility * A.Volatility) + (B.Volatility * B.Volatility))
    // console.log(Math.sqrt((A.Volatility*A.Volatility)+(B.Volatility*B.Volatility)))
    const denom = 1.0 + Math.pow(4, expo)
    return 1.0 / denom
}
const getExpectedRank = (A, List) => {
    let ret = 0.0
    List.forEach(element => {
        if (element.RollNumber != A.RollNumber) {
            ret += getProbablity(A, element)
        }
    });
    return ret
}
const getExpectedPerformance = (N, ER) => {
    return Math.log10(N / ER - 1) / Math.log10(4)
}
const getCF = (List) => {
    const N = List.length
    let V_2 = 0.0
    let Rtot = 0
    List.forEach(element => {
        V_2 += (element.Volatility * element.Volatility)
        Rtot += (element.Rating)
    });
    const Ravg = (Rtot / N)
    let R = 0.0
    List.forEach(element => {
        R += ((element.Rating - Ravg) * (element.Rating - Ravg))
    });
    R /= (N - 1)
    V_2 /= N
    return Math.sqrt(R + V_2)
}
const update = (prevRating, Ranklist) => {
    List = []
    base_case = false
    console.log(prevRating)
    if (prevRating.length == 1) {
        base_case = true
        prevRating.push({ RollNumber: 0, Rating: 1500, Volatility: 125, TimesPlayed: 0 })
    }
    const N = prevRating.length
    let pr = Ranklist[0].Rank;
    console.log(Ranklist)
    let r=1;
    let i=0
    const cf = getCF(prevRating)
    prevRating.forEach(element => {
        const rwa = ((0.4 * element.TimesPlayed + 0.2) / (0.7 * element.TimesPlayed + 0.6))
        const vwa = ((0.5 * element.TimesPlayed + 0.8) / (element.TimesPlayed + 0.6))
        List.push({
            TimesPlayed: (element.TimesPlayed + 1),
            Rating: element.Rating,
            RollNumber: element.RollNumber,
            Volatility: element.Volatility,
            ExpectedPerformance: getExpectedPerformance(N, getExpectedRank(element, prevRating)),
            ActualPerformance: (Math.log10(N / (Ranklist[i].Rank - 1)) / Math.log10(4)),
            RatingWeight: rwa,
            VolatilityWeight: vwa
        })
        if(pr != Ranklist[i].Rank)
        {
            r+=1
            pr=Ranklist[i].Rank
        }
        i+=1
    });
    console.log(List)
    List.forEach(element => {
        let new_rating = element.Rating + (element.ActualPerformance - element.ExpectedPerformance) * cf * element.RatingWeight
        const num = element.VolatilityWeight * (new_rating - element.Rating) * (new_rating - element.Rating) + element.Volatility * element.Volatility
        const denom = element.VolatilityWeight + 1.1
        let new_volatility = Math.sqrt(num / denom)
        const Ratingcap = 100 + (75 / (element.TimesPlayed + 1)) + ((100 * 500) / ((Math.abs(element.Rating - 1500) + 1500)))
        console.log(new_rating)
        if (new_rating > element.Rating) {
            new_rating = Math.min(new_rating, Ratingcap + element.Rating)
        }
        else {
            new_rating = Math.max(new_rating, element.Rating - Ratingcap)
        }
        element.Rating = Math.ceil(new_rating)
        if (new_volatility < 75) {
            new_volatility = 75
        }
        if (new_volatility > 200) {
            new_volatility = 200
        }
        element.Volatility = Math.ceil(new_volatility)
    });
    ret = []
    if (base_case) {
        ret.push({
            RollNumber: List[0].RollNumber,
            Rating: List[0].Rating,
            Volatility: List[0].Volatility,
            TimesPlayed: List[0].TimesPlayed
        })
        return ret
    }
    List.forEach(element => {
        ret.push({
            RollNumber: element.RollNumber,
            Rating: element.Rating,
            Volatility: element.Volatility,
            TimesPlayed: element.TimesPlayed
        })
    });
    return ret
}

module.exports = {
    update: update
}