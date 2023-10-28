import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator } from '@aws-amplify/ui-react'

import QRKiosk from '../component/QRKiosk';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim_id } = this.props.params;

    return (
      <Fragment>
        <div className='App-body'>
          <div className='lb-dash'>
            <QRKiosk moim_id={moim_id} />
          </div>
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { hideSignUp: true });
