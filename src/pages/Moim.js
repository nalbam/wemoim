import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import MoimLogo from '../component/MoimLogo';
import MoimItem from '../component/MoimItem';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { moim_id } = this.props.params;

    return (
      <Fragment>
        <header className='App-header'>
          <MoimLogo moim={moim_id} />
        </header>

        <div className='App-body'>
          <MoimItem moim={moim_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withParams(App);
