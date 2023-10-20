import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'

import signUpConfig from '../config/signUpConfig'

import MoimForm from '../component/MoimForm';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim_id } = this.props.params;

    return (
      <Fragment>
        <header className='App-header'>
          <Authenticator usernameAttributes='email' />
        </header>

        <div className='App-body'>
          <MoimForm moim_id={moim_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { usernameAttributes: 'email', signUpConfig });
