import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let attendeeClass = `lb-row lb-rank${this.props.rank}`;

    return (
      <Fragment>
        <div className={attendeeClass}>
          <div>{this.props.item.attendeeName}</div>
          <div>{this.props.item.laptime}</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
