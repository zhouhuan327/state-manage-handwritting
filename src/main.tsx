import React,{useState} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import ListenerText from './unstated-with-listener/Test'
import UnstatedNextTest from './unstated-next/Test'
import DefaultTest from './default-context/Test'
import ReduxTest from './redux/Test'
function App(){
  const [type,setType] = useState('default')
  return (
    <div className="container">
      <div className="tab-buttons">
        <button onClick={() => setType('default')}>context</button>
        <button onClick={() => setType('redux')}>redux</button>
        <button onClick={() => setType('next')}>unstated-next</button>
        <button onClick={() => setType('listener')}>listener</button>
      </div>
     {type === 'default' &&  <DefaultTest />}
     {type === 'redux' &&  <ReduxTest />}
     {type === 'next' &&  <UnstatedNextTest />}
     {type === 'listener' &&  <ListenerText />}
    </div>
  )
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
