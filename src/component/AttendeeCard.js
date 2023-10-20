import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

class App extends Component {
  state = {
    id: '',
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

    console.log(`getAttendee: ${this.props.attendee_id}`);

    const res = await API.get('attendees', `/items/object/${this.props.attendee_id}`);

    console.log(`getAttendee: ${JSON.stringify(res, null, 2)}`);

    if (res && res.id) {
      this.setState({
        id: res.id,
        moim_id: res.moim_id,
        name: res.name,
        email: res.email,
        phone: res.phone,
        answers: res.answers,
        requests: res.requests,
        track: res.track,
        location: res.location,
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

    console.log(`getMoim: ${JSON.stringify(res, null, 2)}`);

    if (res && res.id) {
      this.setState({
        id: res.id,
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
          <p>※ 행사장 빌딩 및 입구에서 행사 스탭에게 보여주시고 입장해주세요.</p>
          <p>체크인 후, 참가자 기프트 세트를 수령해주세요.</p>
        </div>

      </Fragment>
    );
  }
}

export default App;
