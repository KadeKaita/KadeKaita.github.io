//Comepare two dates

// const deadLine = new Date('2026-12-31')
// const turnIn = new Date()
// console.log(deadLine - turnIn)
// if (deadLine > turnIn){
//     console.log(`"No late work": ${deadLine}`)
//     console.log(`"You turned it in at": ${turn}`)

// }
// else{
//     console.log("Accepted")
// }




const time1 = new Date('2001-09-11')
const time2 = new Date('2026-01-29')

let diff_mills = time2 - time1

//calculat the difference between days
//                            ms.   sec. min. hours
let diff_days = diff_mills / (1000 * 60 * 60 * 24)

console.log(`${diff_days}" days have passed"`)




let d = new Date() //variable to deal with date
console.log(d.toDateString()) //returns day, month, num, year
console.log(d.toLocalString()) //returns timestamp of local stamp
console.log(d.setFullYear(2002)) //returns milliseconds, then just do the math in earlier example to convert to days