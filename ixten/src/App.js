import logo from './logo.svg';
import { StatsRing } from './components/StatsRing';
import { RingProgress } from '@mantine/core';
import './App.css';

function App() {
  return (
    <div className="text-center	 bg-[#282c34]">
      <div className="min-h-[100vh] flex flex-col justify-center items-center text-white gap-16">
        
        <div className='flex flex-row gap-5 justify-center items-center p-3  border-4 border-white rounded-2xl'>
        <RingProgress
      size={180}
      thickness={21}
      roundCaps
      sections={[
        { value: 40, color: 'cyan' },
      ]}
    >Leaffff</RingProgress>
             <h1 className='text-5xl font-bold'>40%</h1>

        </div>
        
        <p className='text-2xl font-semibold'>
        Anti Sus Browsing <br/><br/>
       <span className='text-lg'> A chrome extension to detect suspicious activity in online browsing</span>
        </p>
      </div>
    </div>
  );
}

export default App;
