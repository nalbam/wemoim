import React, { Component, Fragment } from 'react';

import MoimAll from './component/MoimAll';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className='App-header'>
          <div className='logo'>
            <img alt='wemoim' src='/images/wemoim.png' />
          </div>
        </header>

        <MoimAll pathPrefix='' />

        <div className='center'>
          <a href='/manage' className='btn-link'>Manage</a>
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default App;
