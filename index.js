const hackerrank = require('./Hackerrank/hackerrank')
const codechef = require('./Codechef/codechef')

const dburl = 'mongodb://localhost:27017/'
codechef.work(dburl,'https://www.codechef.com/rankings/FEB20B?filterBy=Institution%3DCMR%20College%20of%20Engineering%20%26%20Technology%2C%20Hyderabad',[1,2,3])

