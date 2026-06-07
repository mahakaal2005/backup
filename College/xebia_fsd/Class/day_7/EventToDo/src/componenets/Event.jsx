export default function Event() {
    function handleClick(name) {
        alert(`alert ${name}`)
    }

    function prompter(name){
        prompt(`Hello ${name} \nwill you eat banana`)
    }
    return(
        <div>
            <h1>Event Handling</h1>
            <button onClick={()=>handleClick("KIET")}>Click Me</button>
            <button onClick={()=>prompter("Anana")}>THis is 2nd button</button>
        </div>
    )
}