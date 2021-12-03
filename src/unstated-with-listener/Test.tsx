import React, { memo, useContext, useState } from 'react'
import { createContainer } from './createContainer';
const useStoreHook =  () => {
 // 定义状态
 const [count, setCount] = React.useState(0);
 const increment = () => setCount(count + 1);
 const decrement = () => setCount(count - 1);
 return {
   count,
   setCount,
   increment,
   decrement,
 };
}
const Store = createContainer(useStoreHook)
function App() {
  console.log('app render')
 
  return (
  <Store.Provider>
    <h1>对unstated-next进行一定优化，使用listener控制订阅状态的组件render</h1>
    <Header />
    <Main />
    <Footer />
  </Store.Provider>
  )
}
function Header() {
  console.log('header render')
  const count = Store.useSelector(state => state.count)
  return <header>header{count}</header>
}
function Main() {
  console.log('Main render')
  const {count,increment} = Store.useSelector(state => state)
  return <main> Main: count:{count} <button onClick={increment}>increase </button></main>
}
function Footer(){
  console.log('footer 没用到状态 render')
  return <footer>footer 没用到状态</footer>
}
export default memo(App)
