import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

class App extends Component {
  state = {
    logo: '/images/wemoim.png',
    title: '',
    dateClose: '',
    dateOpen: '',
    timeZone: '',
  }

  componentDidMount() {
    this.getMoim();
  }

  getMoim = async () => {
    if (!this.props.moim_id || this.props.moim_id === 'undefined') {
      return;
    }

    console.log(`getMoim ${this.props.moim_id}`);

    const res = await API.get('moims', `/items/object/${this.props.moim_id}`);
    if (res && res.moim) {
      this.setState({
        logo: res.logo,
        title: res.title,
        dateClose: res.dateClose,
        dateOpen: res.dateOpen,
        timeZone: res.timeZone,
      });
    }
  };

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>

        <h1 id='title' className='title'>
          {this.state.title}
        </h1>
      </Fragment>
    );
  }
}

export default App;