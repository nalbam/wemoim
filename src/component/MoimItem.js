import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let path = `${this.props.pathPrefix}/moim/${this.props.item.id}`;

    return (
      <Fragment>
        <div className='lb-row'>
          <div><img src={this.props.item.logo} alt='logo' className='icon-logo' /></div>
          <div><a href={path}>{this.props.item.title}</a></div>
          <div>{this.props.item.date_start}</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
