import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import MoimHeader from '../component/MoimHeader';
import AttendeeCard from '../component/AttendeeCard';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { attendee_id } = this.props.params;

    return (
      <Fragment>
        <header className='App-header'>
          <MoimHeader attendee_id={attendee_id} />
        </header>

        <div className='App-body'>
          <AttendeeCard attendee_id={attendee_id} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withParams(App);
