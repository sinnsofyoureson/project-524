import React from 'react';
import logo from './logo.svg';
import './App.css';
import Component from './components/Component';

const App: React.FC = (props: any) => {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Component {...props} />
      </header>
    </div>
  );
}

export default App;