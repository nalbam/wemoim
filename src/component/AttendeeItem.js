import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let trophy = '';

    if (this.props.item.attendance) {
      trophy = <img src='/images/done.png' className='icon-trophy' />
    }

    return (
      <Fragment>
      <div className='lb-row'>
          <div>{trophy}</div>
          <div>{this.props.item.name}</div>
          <div>{this.props.item.email}</div>
          <div>{this.props.item.phone}</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
