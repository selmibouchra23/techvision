import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { MyProvider } from './context/myContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MyProvider>
  <Provider store={store}>
    <App />
  </Provider>
    </MyProvider>
  
);

