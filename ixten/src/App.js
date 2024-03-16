import logo from './logo.svg';
import { StatsRing } from './components/StatsRing';
import { RingProgress } from '@mantine/core';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <StatsRing/> */}
        <div className='ring'>
        <RingProgress
      size={220}
      thickness={21}
      roundCaps
      sections={[
        { value: 40, color: 'cyan' },
      ]}
    >Leaffff</RingProgress>
        </div>
        
         <h1 className='val'>40%</h1>
        <p>
        Anti Sus Browsing <br/>
        A chrome extension to detect sus activity in online browsing
        </p>
      </div>
    </div>
  );
}

export default App;
