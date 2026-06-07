// for(let i=1;i<=5;i++){
//     console.log("for loop: ",i);
// }

// let x=5;
// while(x>=0){
//     console.log("while loop: ",x--);
// }

// do{
//     console.log("do while loop: ",x--);
// }while(x>0);

// let arr=[1,2,3];
// arr.forEach((item)=>console.log(item));


// function greet(name){
//     console.log(`Hello ${name}`)
// }

// greet("Atul");

// function add(a,b){
//     return (a+b)
// }

// console.log(add(10,20));

// let c= add(10,20);
// console.log(c);

// const factorial= function(n){
//     if(n==1 || n==0) return 1;
//     else return n*factorial(n-1);
// }

// console.log(factorial(5));


const prev = function(n){
    while(n > 0){
        console.log(n--);
    }
}

console.log(prev(10));