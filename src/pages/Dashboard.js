import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator } from '@aws-amplify/ui-react'

import AttendeeList from '../component/AttendeeList';
import AttendeeForm from '../component/AttendeeForm';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.listCmp = React.createRef();
    this.formCmp = React.createRef();
  }

  selectAttendee = (attendee_id) => {
    this.formCmp.current.selectAttendee(attendee_id, false);
  }

  render() {
    let { moim_id, attendee_id } = this.props.params;

    return (
      <Fragment>
        <div className='App-body'>
          <div className='lb-dash'>
            <AttendeeList ref={this.listCmp} moim_id={moim_id} selectAttendee={this.selectAttendee} />
            <AttendeeForm ref={this.formCmp} moim_id={moim_id} attendee_id={attendee_id} />
          </div>
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { hideSignUp: true });
