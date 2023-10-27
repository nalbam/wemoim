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
    company: '',
    answers: '',
    requests: '',
    track: '',
    location: '',
    attendance: false,
    received: false,
    scaned: false,
  }

  selectAttendee(attendee_id, scaned) {
    this.setState({
      scaned: scaned,
    });

    this.getAttendee(attendee_id, scaned);

    $('html, body').stop().animate({
      scrollTop: 200
    }, 500);
  }

  resetAttendee() {
    this.setState({
      attendee_id: '',
      name: '',
      email: '',
      phone: '',
      company: '',
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

    if (!res || res.attendee_id === 'undefined') {
      this.popupCmp.current.start('일치하는 정보가 없습니다.');
      return;
    }

    if (res.moim_id !== this.props.moim_id) {
      this.popupCmp.current.start('모임이 일치하지 않습니다.');
      return;
    }

    let attendance = res.attendance;

    let body = {
      moim_id: res.moim_id,
      attendee_id: res.attendee_id,
      name: res.name,
      email: res.email,
      phone: res.phone,
      company: res.company,
      answers: res.answers,
      requests: res.requests,
      track: res.track,
      location: res.location,
      attendance: scaned || attendance,
      received: res.received,
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

  postAttendee = async () => {
    let attendee_id = this.state.attendee_id;

    if (!attendee_id || attendee_id === '') {
      attendee_id = uuidv4();
    }

    try {
      let body = {
        moim_id: this.props.moim_id,
        attendee_id: attendee_id,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        company: this.state.company,
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

      this.setState({
        attendee_id: attendee_id,
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

  normalizePhone(v) {
    if (!v) return v;
    let cv = v.replace(/[^\d]/g, '');
    if (cv.length + 1 === v.length && v[v.length - 1] === '-') return v;
    if (cv.length < 4) return cv;
    if (cv.length + 2 === v.length && v[v.length - 1] === '-') return v;
    if (cv.length < 8) return `${cv.slice(0, 3)}-${cv.slice(3)}`;
    return `${cv.slice(0, 3)}-${cv.slice(3, 7)}-${cv.slice(7, 11)}`;
  }

  handleChange = (e) => {
    let k = e.target.name;
    let v = e.target.value;

    switch (k) {
      case 'email':
        v = v.toLowerCase();
        break;
      case 'phone':
        v = this.normalizePhone(v);
        break;
      case 'requests':
        v = v.toUpperCase();
        break;
      default:
    }

    this.setState({
      [k]: v,
    });

    this.validate(k, v);
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

  handleReset = (e) => {
    this.resetAttendee();
  }

  render() {
    let reader = '/manage/reader/' + this.props.moim_id;

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
                  <input type='text' name='email' value={this.state.email} onChange={this.handleChange} className={this.state.email_class} placeholder='my@email.com' autoComplete='off' maxLength='256' />
                </div>
              </div>
              <div className='lb-row'>
                <div>휴대폰</div>
                <div>
                  <input type='text' name='phone' value={this.state.phone} onChange={this.handleChange} className={this.state.phone_class} placeholder='010-0000-0000' autoComplete='off' maxLength='13' />
                </div>
              </div>
              <div className='lb-row'>
                <div>소속</div>
                <div>
                  <input type='text' name='company' value={this.state.company} onChange={this.handleChange} className='text_normal' placeholder='' autoComplete='off' maxLength='256' />
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
                <div>
                  <button type='submit' className='btn-submit'>Save</button>
                  <button type='button' className='btn-submit' onClick={this.handleReset}>Reset</button>
                </div>
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
            constraints={{
              facingMode: 'environment'
            }}
          />

          <div className='center'>
            <a href={reader} className='btn-link'>QR Reader</a>
          </div>
        </div>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
