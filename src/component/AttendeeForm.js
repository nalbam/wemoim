import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import { v4 as uuidv4 } from 'uuid';

import { QrReader } from 'react-qr-reader';

import $ from 'jquery';

import Popup from './Popup';

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    moim_id: '',
    attendee_id: '',
    name: '',
    name_class: 'text_normal',
    email: '',
    email_class: 'text_normal',
    phone: '',
    phone_class: 'text_normal',
    answers: '',
    requests: '',
    track: '',
    location: '',
    attendance: false,
    received: false,
    scaned: false,
  }

  componentDidMount() {
    if (this.props.moim_id && this.props.moim_id !== 'undefined') {
      this.setState({
        moim_id: this.props.moim_id,
      });
    }
  }

  selectAttendee(attendee_id, scaned) {
    this.setState({
      scaned: scaned,
    });

    this.getAttendee(attendee_id, scaned);

    $('html, body').stop().animate({
      scrollTop: 0
    }, 500);
  }

  resetAttendee() {
    this.setState({
      attendee_id: '',
      name: '',
      email: '',
      phone: '',
      answers: '',
      requests: '',
      track: '',
      location: '',
      attendance: false,
      received: false,
      scaned: false,
    });
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

  postAttendee = async () => {
    let attendee_id = this.state.attendee_id;

    if (!attendee_id || attendee_id === '') {
      attendee_id = uuidv4();

      this.setState({
        attendee_id: attendee_id,
      });
    }

    try {
      let body = {
        moim_id: this.state.moim_id,
        attendee_id: attendee_id,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        answers: this.state.answers,
        requests: this.state.requests,
        track: this.state.track,
        location: this.state.location,
        attendance: this.state.attendance,
        received: this.state.received,
      };

      console.log('postAttendee: ' + JSON.stringify(body, null, 2));

      const res = await API.post('attendees', '/items', {
        body: body
      });

      console.log('postAttendee: ' + JSON.stringify(res, null, 2));

      this.popupCmp.current.start('Saved!');

      // this.resetAttendee();
    } catch (err) {
      console.log(`postAttendee: ${JSON.stringify(err.message, null, 2)}`);

      this.popupCmp.current.start('Error!');
    }
  };

  testEmail(val) {
    var re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\].,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }

  testPhone(val) {
    var re = /^([0-9]{3}-[0-9]{4}-[0-9]{4})$/;
    return re.test(val);
  }

  getClassValue(b, v) {
    if (b) {
      return `text_normal ${v}`;
    } else {
      return `text_red ${v}`;
    }
  }

  validateName(v) {
    let b = (v !== '');
    this.setState({
      name_class: this.getClassValue(b),
    });
    return b;
  }

  validateEmail(v) {
    let b = (v !== '' && this.testEmail(v));
    this.setState({
      email_class: this.getClassValue(b),
    });
    return b;
  }

  validatePhone(v) {
    let b = (v !== '' && this.testPhone(v));
    this.setState({
      phone_class: this.getClassValue(b),
    });
    return b;
  }

  validateAll() {
    let b = true;
    b = b && this.validateName(this.state.name);
    b = b && this.validateEmail(this.state.email);
    b = b && this.validatePhone(this.state.phone);
    return b;
  }

  validate(k, v) {
    let b = false;
    switch (k) {
      case 'name':
        b = this.validateName(v);
        break;
      case 'email':
        b = this.validateEmail(v);
        break;
      case 'phone':
        b = this.validatePhone(v);
        break;
      default:
    }
    return b;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });

    this.validate(e.target.name, e.target.value);
  }

  handleCheckBox = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateAll()) {
      return;
    }

    this.postAttendee();
  }

  render() {
    return (
      <Fragment>
        <div className='lb-right'>
          <form onSubmit={this.handleSubmit}>
            <div className='lb-submit'>
              <div className='lb-row'>
                <div>ID</div>
                <div>
                  {this.state.attendee_id}
                </div>
              </div>
              <div className='lb-row'>
                <div>이름</div>
                <div>
                  <input type='text' name='name' value={this.state.name} onChange={this.handleChange} className={this.state.name_class} placeholder='' autoComplete='off' maxLength='32' />
                </div>
              </div>
              <div className='lb-row'>
                <div>이메일</div>
                <div>
                  <input type='text' name='email' value={this.state.email} onChange={this.handleChange} className={this.state.email_class} placeholder='' autoComplete='off' maxLength='256' />
                </div>
              </div>
              <div className='lb-row'>
                <div>휴대폰</div>
                <div>
                  <input type='text' name='phone' value={this.state.phone} onChange={this.handleChange} className={this.state.phone_class} placeholder='010-0000-0000' autoComplete='off' maxLength='13' />
                </div>
              </div>
              <div className='lb-row'>
                <div>응답</div>
                <div>
                  <input type='text' name='answers' value={this.state.answers} onChange={this.handleChange} className='text_normal' placeholder='' autoComplete='off' maxLength='256' />
                </div>
              </div>
              <div className='lb-row'>
                <div>요청</div>
                <div>
                  <input type='text' name='requests' value={this.state.requests} onChange={this.handleChange} className='text_normal' placeholder='' autoComplete='off' maxLength='256' />
                </div>
              </div>
              <div className='lb-row'>
                <div>트랙</div>
                <div>
                  <input type='text' name='track' value={this.state.track} onChange={this.handleChange} className='text_normal' placeholder='' autoComplete='off' maxLength='256' />
                </div>
              </div>
              <div className='lb-row'>
                <div>장소</div>
                <div>
                  <input type='text' name='location' value={this.state.location} onChange={this.handleChange} className='text_normal' placeholder='' autoComplete='off' maxLength='256' />
                </div>
              </div>
              <div className='lb-row'>
                <div>참석</div>
                <div>
                  <div><label><input type='checkbox' name='attendance' value='Y' checked={this.state.attendance} onChange={this.handleCheckBox} className='checkbox' /></label></div>
                </div>
              </div>
              <div className='lb-row'>
                <div>수령</div>
                <div>
                  <div><label><input type='checkbox' name='received' value='Y' checked={this.state.received} onChange={this.handleCheckBox} className='checkbox' /></label></div>
                </div>
              </div>
              <div className='lb-row'>
                <div></div>
                <div><button type='submit' className='btn-submit'>Save</button></div>
              </div>
            </div>
          </form>

          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                this.selectAttendee(result?.text, true);
              }
              // if (!!error) {
              //   console.info(error);
              // }
            }}
            className='qr-reader'
          />
        </div>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
