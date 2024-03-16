import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import { StatsRing } from '../components/StatsRing';
import './Popup.css';

const Popup = () => {
  return (
    <div className="App">
      <div className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <StatsRing/>
        <p>
        Anti Sus Browsing <br/>
        A chrome extension to detect sus activity in online browsing
        </p>
      
      </div>
    </div>
  );
};

export default Popup;
