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
    moim_id: '',
    logo: 'https://wemoim.com/images/wemoim.png',
    title: '',
    desc: '',
    questions: '',
    date_start: '',
    date_end: '',
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
      // 자동 출석
      const res = await API.post('attendees', '/items', {
        body: body
      });

      if (res) {
        this.popupCmp.current.start('출석!');
      }
    }
  };

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>

        <div className='lb-items'>
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
          /></div>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
