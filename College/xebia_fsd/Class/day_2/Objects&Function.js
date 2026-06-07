// const obj={name:"Dennis"};
// console.log(obj.name);
// obj.name="Ritchie";
// console.log(obj.name);

// const sales ="Toyota";
// function Types(name){
//     return name==="Honda"?name:"Sorry";
// }

// const car ={mycar:"Saturn", getcar:Types("Honda"),special:sales};
// console.log(car.mycar);
// console.log(car.getcar);
// console.log(car.special);

// const student={name:"Atul",age:23,course:"Btech"};
// for(let key in student){
//     console.log(key,student[key]);
//}

const colors=["Red","Green","Blue"];
// for(let index in colors){
//     console.log(index,colors[index]);
// }

// for(const item of colors){
//     console.log(item);
// }

// let count=0;

// for(const char of "JavaScript"){
//     if("aeiou".includes(char.toLowerCase())){
//         count++;
//     }
// }

// console.log(count);

for(const[index,color] of colors.entries()){
    console.log(index,color);
}