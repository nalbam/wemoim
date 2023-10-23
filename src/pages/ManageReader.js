import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator } from '@aws-amplify/ui-react'

import QRReader from '../component/QRReader';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim_id } = this.props.params;

    return (
      <Fragment>
        <div className='App-body'>
          <QRReader moim_id={moim_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { hideSignUp: true });
