import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'

import signUpConfig from '../config/signUpConfig'

import MoimHeader from '../component/MoimHeader';
import MoimForm from '../component/MoimForm';

import QRCode from '../component/QRCode';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim } = this.props.params;

    return (
      <Fragment>
        <header className='App-header'>
          <Authenticator usernameAttributes='email' />
        </header>

        <header className='App-header'>
          <MoimHeader moim={moim} />
        </header>

        <div className='App-body'>
          <MoimForm moim={moim} />
        </div>

        <footer className='App-footer'>
          <QRCode moim={moim} />
        </footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { usernameAttributes: 'email', signUpConfig });
