import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header/>
      <h1>Hello!!!</h1>
      <h2>There</h2>
      <Footer/>
    </div>
    
  )
}