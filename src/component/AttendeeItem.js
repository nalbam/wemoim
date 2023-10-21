import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    const { selectAttendee } = this.props;

    let attendance = '';
    let received = '';

    if (this.props.item.attendance) {
      attendance = <img src='/images/done.png' alt='done' className='icon-trophy' />
    } else {
      attendance = <img src='/images/none.png' alt='none' className='icon-trophy' />
    }

    if (this.props.item.received) {
      received = <img src='/images/done.png' alt='done' className='icon-trophy' />
    } else {
      received = <img src='/images/none.png' alt='none' className='icon-trophy' />
    }

    return (
      <Fragment>
        <div className='lb-row' onClick={() => selectAttendee(this.props.item.attendee_id)}>
          <div>{attendance} {received}</div>
          <div>{this.props.item.name}</div>
          <div>{this.props.item.email}</div>
          <div>{this.props.item.phone}</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
