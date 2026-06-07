import "./Table.css"

export default function(props){
    return(
        <table className="Table">
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
            </tr>
            <tr>
                <td>{props.name}</td>
                <td>{props.age}</td>
                <td>{props.city}</td>
            </tr>
        </table>
    )
}