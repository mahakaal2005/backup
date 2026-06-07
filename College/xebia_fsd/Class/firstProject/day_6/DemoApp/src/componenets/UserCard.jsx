export default function UserCard({user}){
    return(
        <div>
            <h3>User Name:{user.name}</h3>
            <p>Age: {user.age}</p>
            <p>Country: {user.country}</p>
        </div>
    )
}