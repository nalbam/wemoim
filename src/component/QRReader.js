import React, { Component, Fragment } from 'react';

import { QrReader } from 'react-qr-reader';

class App extends Component {
  selectAttendee(attendee_id) {
    console.log(`QrReader: ${attendee_id}`);

    // var parent = this._reactInternalInstance._currentElement._owner._instance;
    // parent.selectAttendee(attendee_id);
  }

  render() {
    return (
      <Fragment>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              this.selectAttendee(result?.text);
            }
            // if (!!error) {
            //   console.info(error);
            // }
          }}
          className='qr-reader'
        />
      </Fragment>
    );
  }
}

export default App;
