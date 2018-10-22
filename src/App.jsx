import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import './static/style/App.css';
import Coins from './components/Coins';
import Stocks from './components/Stocks';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to M O S A | C
        </p>
        <Tabs>
          <TabList>
            <Tab><NavLink exact to="/stocks">Stocks</NavLink></Tab>
            <Tab><NavLink exact to="/coins">Crypto</NavLink></Tab>
          </TabList>
          <TabPanel>
            <Stocks url="http://127.0.0.1:5000/api/v1/stocks/" />
          </TabPanel>
          <TabPanel>
            <Coins />
          </TabPanel>
        </Tabs>
      </header>
    </div>
  );
}

export default App;
