import React, { Component, Fragment } from 'react';

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'

import MoimList from '../component/MoimList';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className='App-header'>
          <Authenticator>
            {({ signOut, user }) => (
              <div className='center'>
                <h1>WeMoim Manage {user.email}</h1>
                <button onClick={signOut}>Sign out</button>
              </div>
            )}
          </Authenticator>
        </header>

        <div className='App-body'>
          <MoimList pathPrefix='/manage' />
        </div>

        <div className='center'>
          <a href='/manage/moim' className='btn-link'>Create</a>
        </div>

        <footer className='App-footer'></footer>
      </Fragment >
    );
  }
}

export default withAuthenticator(App, { hideSignUp: true });
