import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

class App extends Component {
  state = {
    attendee_id: '',
    moim_id: '',
    logo: 'https://wemoim.com/images/wemoim.png',
    title: '',
    desc: '',
    questions: '',
    date_start: '',
    date_end: '',
    name: '',
    email: '',
    phone: '',
  }

  componentDidMount() {
    this.getAttendee();
  }

  getAttendee = async () => {
    if (!this.props.attendee_id || this.props.attendee_id === 'undefined') {
      return;
    }

    let body = {
      attendee_id: this.props.attendee_id,
    };

    console.log(`getAttendee: ${JSON.stringify(body, null, 2)}`);

    const res = await API.get('attendees', `/items/id/${this.props.attendee_id}`);

    // console.log(`getAttendee: ${JSON.stringify(res, null, 2)}`);

    if (res && res.length > 0) {
      this.setState({
        moim_id: res[0].moim_id,
        name: res[0].name,
        email: res[0].email,
        phone: res[0].phone,
        answers: res[0].answers,
        requests: res[0].requests,
        track: res[0].track,
        location: res[0].location,
        attendance: res[0].attendance,
      });
    }

    this.getMoim();
  };

  getMoim = async () => {
    if (!this.state.moim_id || this.state.moim_id === 'undefined') {
      return;
    }

    console.log(`getMoim: ${this.state.moim_id}`);

    const res = await API.get('moims', `/items/object/${this.state.moim_id}`);

    // console.log(`getMoim: ${JSON.stringify(res, null, 2)}`);

    if (res && res.moim_id) {
      this.setState({
        moim_id: res.moim_id,
        logo: res.logo,
        title: res.title,
        desc: res.desc,
        msg_card: res.msg_card,
        date_start: res.date_start,
        date_end: res.date_end,
      });
    }
  };

  render() {
    let qr = `https://qr.nalbam.com/qr.png?body=${this.props.attendee_id}`;

    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>

        <div className='qr'>
          <img id='qr' src={qr} alt='qr' />
        </div>

        <div className='name'>
          <h1 id='name'>{this.state.name} ({this.state.requests})</h1>
        </div>

        <div className='track'>
          <p>{this.state.track}</p>
          <p>{this.state.location}</p>
        </div>

        <div className='desc'>
          <p>{this.state.msg_card}</p>
        </div>
      </Fragment>
    );
  }
}

export default App;
