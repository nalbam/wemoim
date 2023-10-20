import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let path1 = `${this.props.pathPrefix}/moim/${this.props.item.moim_id}`;
    let path2;
    if (this.props.pathPrefix === '/manage') {
      path2 = `${this.props.pathPrefix}/attendees/${this.props.item.moim_id}`;
    } else {
      path2 = `${this.props.pathPrefix}/moim/${this.props.item.moim_id}`;
    }

    return (
      <Fragment>
        <div className='lb-row'>
          <div><img src={this.props.item.logo} alt='logo' className='icon-logo' /></div>
          <div><a href={path1}>{this.props.item.title}</a></div>
          <div><a href={path2}>{this.props.item.date_start}</a></div>
        </div>
      </Fragment>
    );
  }
}

export default App;
