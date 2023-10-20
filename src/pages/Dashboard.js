import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'

import signUpConfig from '../config/signUpConfig'

import AttendeesForm from '../component/AttendeeForm';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim_id } = this.props.params;

    return (
      <Fragment>
        <div className='App-body'>
          <AttendeesForm moim_id={moim_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { usernameAttributes: 'email', signUpConfig });
