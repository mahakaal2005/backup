console.log("Beginning");

setTimeout(() => {
    console.log("Data Initiated");
}, 2000);

console.log("End"); 

fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching data:", error));