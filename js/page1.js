$(document).ready(function () {
    console.log("ready")
    $.get("https://www.hackerrank.com/rest/contests/smart-interviews?&_=1583901942873",function(data){
        console.log(data)
    })
})

$("#form1").submit(function () {
    alert("ABC")
    console.log("1")
    
})