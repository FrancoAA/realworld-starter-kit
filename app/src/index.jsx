import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import ApiService from './common/api.service';

ApiService.init();

ReactDOM.render(<App />, document.getElementById('root'));
