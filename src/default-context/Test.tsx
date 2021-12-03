import React, { createContext, memo, useContext, useMemo } from 'react'
const Context = createContext<any>(undefined)
function App() {
  console.log('app render')
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return (
  <Context.Provider value={{count,setCount,increment,decrement}}>
      <h1>使用默认的Context透传</h1>
      <Header />
      <Main />
      <Footer />
  </Context.Provider>
  )
}

function Header() {
  console.log('header render')
  const state = useContext(Context)
  return <header> header{state.count}</header>
}
function Main() {
  console.log('Main render')
  const state = useContext(Context)
  return <main> Main: count:{state.count} <button onClick={state.increment}>increase </button></main>
}
function Footer(){
  console.log('footer 没用到状态 render')
  return <footer>footer 没用到状态</footer>
}
export default memo(App)
