import { useState } from 'react'
import QuizGenerator from './05-pages/02-PublicPages/home'
 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       
    <QuizGenerator/>
    </>
  )
}

export default App
