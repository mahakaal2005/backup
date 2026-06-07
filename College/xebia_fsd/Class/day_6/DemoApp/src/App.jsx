  import './App.css'
import UserCard from './componenets/UserCard'
import Wrapper from './componenets/Wrapper'

function App() {
  const users=[
    {
      name:'Virat Kohli',
      age:30,
      country:'Bharat'
    },
    {
      name:'Ms. Dhoni',
      age:25,
      country:'Bharat'
    }
  ]

  return (
    <>
      <div>
        <h1>Users Dashboard</h1>
        <Wrapper title="User Information">
          {
          users.map((use,index)=><UserCard key={index} user={use}/>)
          }
        </Wrapper>
      </div>
    </>
  )
}

export default App
