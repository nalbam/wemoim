import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import MoimHeader from '../component/MoimHeader';
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
          <MoimHeader moim_id={moim_id} />
        </header>

        <div className='App-body'>
          <MoimItem moim_id={moim_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withParams(App);
