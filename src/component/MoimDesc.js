import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

class App extends Component {
  state = {
    logo: '/images/blank.png',
    title: '',
    desc: '',
    email: '',
    email_class: 'text_normal',
    phone: '',
    phone_class: 'text_normal',
  }

  componentDidMount() {
    this.getMoim();
  }

  getMoim = async () => {
    if (!this.props.moim_id || this.props.moim_id === 'undefined') {
      return;
    }

    console.log(`getMoim: ${this.props.moim_id}`);

    const res = await API.get('moims', `/items/object/${this.props.moim_id}`);

    // console.log(`getMoim: ${JSON.stringify(res, null, 2)}`);

    if (res && res.moim_id) {
      this.setState({
        logo: res.logo,
        title: res.title,
        desc: res.desc,
        questions: res.questions,
        date_start: res.date_start,
        date_end: res.date_end,
      });
    }
  };

  render() {
    let path = `/signin/${this.props.moim_id}`;

    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>

        <div className='desc' dangerouslySetInnerHTML={{__html: this.state.desc}}></div>

        <div className='center'>
          <a href={path} className='btn-link'>Sign In</a>
        </div>
      </Fragment>
    );
  }
}

export default App;
