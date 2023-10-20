import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let attendeeClass = `lb-row lb-rank${this.props.rank}`;
    let attendeeRank = this.props.rank;
    let trophy = '';

    if (attendeeRank < 4) {
      trophy = <img src='/images/icon-trophy.png' alt='trophy' className='icon-trophy' />
    }

    return (
      <Fragment>
        <div className={attendeeClass}>
          <div>{trophy} {attendeeRank}</div>
          <div>{this.props.item.attendeeName}</div>
          <div>{this.props.item.laptime}</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
