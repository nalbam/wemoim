import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import MoimDesc from '../component/MoimSignin';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim_id } = this.props.params;

    return (
      <Fragment>
        <div className='App-body'>
          <MoimDesc moim_id={moim_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withParams(App);
