import React, { memo } from 'react'
import { createStore, Provider, connect } from './'
const preloadedState = {
  count: 0
}
const reducer = (state: typeof preloadedState, action: { type: string; paload?: any }) => {
  switch (action.type) {
    case 'increment':
      return {
        ...state, count: state.count + 1
      }
    case 'decrement':
      return {
        ...state, count: state.count - 1
      }
    default:
      return state
  }
}
const store = createStore(preloadedState, reducer)
function App() {
  console.log('app render')

  return (
    <Provider value={store}>
      <h1>redux</h1>
      <Header />
      <Main />
      <Footer />
    </Provider>
  )
}
const Header = connect(
  (state: any) => ({ count: state.count })
)(({ count }) => {
  console.log('header render')
  return <header> header{count}</header>
})
const Main = connect(
  (state: any) => ({ count: state.count }),
  (dispatch) => ({ increment: () => dispatch({ type: 'increment' }) })
)((props) => {
  console.log('main render')
  const { count, increment } = props
  return <main> Main: count:{count} <button onClick={increment}>increase </button></main>
})
function Footer() {
  console.log('footer 没用到状态 render')
  return <footer>footer 没用到状态</footer>
}
export default memo(App)
