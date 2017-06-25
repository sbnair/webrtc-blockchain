import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import Blockchain from './Blockchain';

Blockchain.init();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
