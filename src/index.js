import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import * as serviceWorker from './serviceWorker';

import AppProvider from './context/AppProvider'

import App from './App';
import Card from './pages/Card'
import Dashboard from './pages/Dashboard'
import Manage from './pages/Manage'
import ManageMoim from './pages/ManageMoim'
import Moim from './pages/Moim'
import Reader from './pages/Reader'
import Signin from './pages/Signin'

import { Amplify } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';

import './App.css';
import './pop.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

// Analytics.record('Page_Load');
// Analytics.autoTrack('pageView', {
//     enable: true,
//     type: 'SPA'
// })

const routing = (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<App />} />
        <Route path='/manage/moim/' element={<ManageMoim />} />
        <Route path='/manage/moim/:moim_id' element={<ManageMoim />} />
        <Route path='/manage/reader/:moim_id' element={<Reader />} />
        <Route path='/manage/:moim_id' element={<Dashboard />} />
        <Route path='/manage/' element={<Manage />} />
        <Route path='/moim/:moim_id' element={<Moim />} />
        <Route path='/signin/:moim_id' element={<Signin />} />
        <Route path='/card/:attendee_id' element={<Card />} />
        <Route element={App} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
