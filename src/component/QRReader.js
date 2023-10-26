import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import { QrReader } from 'react-qr-reader';

import Popup from './Popup';

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    attendee_id: '',
    moim_id: '',
    logo: '/images/blank.png',
    title: '',
    desc: '',
    questions: '',
    date_start: '',
    date_end: '',
    name: '',
    email: '',
    phone: '',
    requests: '',
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

    console.log(`getMoim: ${JSON.stringify(res, null, 2)}`);

    if (res && res.moim_id) {
      this.setState({
        moim_id: res.moim_id,
        logo: res.logo,
        title: res.title,
        desc: res.desc,
        questions: res.questions,
        date_start: res.date_start,
        date_end: res.date_end,
      });
    }
  };

  selectAttendee(attendee_id) {
    this.getAttendee(attendee_id, true);
  }

  getAttendee = async (attendee_id, scaned) => {
    console.log(`getAttendee: ${attendee_id}`);

    const res = await API.get('attendees', `/items/id/${attendee_id}`);

    // console.log(`getAttendee: ${JSON.stringify(res, null, 2)}`);

    if (!res || res.length === 0) {
      this.popupCmp.current.start('일치하는 정보가 없습니다.');
      return;
    }

    if (res[0].moim_id !== this.props.moim_id) {
      this.popupCmp.current.start('모임이 일치하지 않습니다.');
      return;
    }

    let attendance = res[0].attendance;

    let body = {
      moim_id: res[0].moim_id,
      attendee_id: res[0].attendee_id,
      name: res[0].name,
      email: res[0].email,
      phone: res[0].phone,
      answers: res[0].answers,
      requests: res[0].requests,
      track: res[0].track,
      location: res[0].location,
      attendance: scaned || attendance,
      received: res[0].received,
    }

    this.setState(body);

    if (scaned && !attendance) {
      // 자동 참석
      const res = await API.post('attendees', '/items', {
        body: body
      });

      if (res) {
        this.popupCmp.current.start('참석!');
      }
    }
  };

  render() {
    let name = '';
    let attendance = '';
    let received = '';

    if (this.state.name !== '') {
      name = `${this.state.name} (${this.state.requests})`;

      if (this.state.attendance) {
        attendance = <img src='/images/done.png' alt='done' className='icon-check' />
      } else {
        attendance = <img src='/images/none.png' alt='none' className='icon-check' />
      }

      if (this.state.received) {
        received = <img src='/images/done.png' alt='done' className='icon-check' />
      } else {
        received = <img src='/images/none.png' alt='none' className='icon-check' />
      }
    }

    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>

        <div className='lb-reader'>
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
            constraints={{
              facingMode: 'environment'
            }}
          />
        </div>

        <div className='name'>
          <p>{name}</p>
        </div>

        <div className='track'>
          <p>{this.state.track}</p>
          <p>{this.state.location}</p>
        </div>

        <div className='desc'>
          <p>{attendance} {received}</p>
        </div>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
