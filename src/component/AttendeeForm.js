import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Popup from './Popup';

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    email_class: 'text_normal width_80',
    email: '',
    forceUpdate: false,
    forceDelete: false,
    laptime_class: 'text_normal',
    laptime: '',
    attendeeName_class: 'text_normal width_80',
    attendeeName: '',
  }

  postAttendee = async () => {
    console.log('postAttendee');

    try {
      let body = {
        moim: this.props.moim,
        email: this.state.email,
        attendeeName: this.state.attendeeName,
        laptime: this.state.laptime,
        forceUpdate: this.state.forceUpdate,
        forceDelete: this.state.forceDelete,
      };

      console.log('postAttendee: ' + JSON.stringify(body, null, 2));

      const res = await API.post('attendees', '/items', {
        body: body
      });

      console.log('postAttendee: ' + JSON.stringify(res, null, 2));

      if (this.state.forceDelete) {
        this.popupCmp.current.start(2000, 'Deleted!');
      } else {
        this.popupCmp.current.start(2000, 'Saved!');
      }

      this.setState({
        email: '',
        attendeeName: '',
        laptime: '',
        forceUpdate: false,
        forceDelete: false,
      });
    } catch (err) {
      console.log('postAttendee: ' + JSON.stringify(err, null, 2));

      this.popupCmp.current.start(2000, err.message);
    }
  };

  testEmail(val) {
    var re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\].,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }

  getClassValue(b, v) {
    if (b) {
      return `text_normal ${v}`;
    } else {
      return `text_red ${v}`;
    }
  }

  validateAttendeeEmail(v) {
    let b = (v !== '' && this.testEmail(v));
    this.setState({
      email_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateAttendeeName(v) {
    let b = (v !== '');
    this.setState({
      attendeeName_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateAttendeeTime(v) {
    let b = (v !== '' && this.validateTime(v));
    this.setState({
      laptime_class: this.getClassValue(b),
    });
    return b;
  }

  validateAll() {
    let a = this.validateAttendeeEmail(this.state.email);
    let b = this.validateAttendeeName(this.state.attendeeName);
    let c = this.validateAttendeeTime(this.state.laptime);
    return a && ((b && c) || this.state.forceDelete);
  }

  validate(k, v) {
    let b = false;

    switch (k) {
      case 'email':
        b = this.validateAttendeeEmail(v);
        break;
      case 'attendeeName':
        b = this.validateAttendeeName(v);
        break;
      case 'laptime':
        b = this.validateAttendeeTime(v);
        break;
      case 'forceUpdate':
        b = true;
        break;
      case 'forceDelete':
        b = true;
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
        <form onSubmit={this.handleSubmit}>
          <div className='lb-submit'>
            <div className='lb-row'>
              <div>Email</div>
              <div>
                <input type='text' name='email' value={this.state.email} onChange={this.handleChange} className={this.state.email_class} placeholder='' autoComplete='off' maxLength='256' />
              </div>
            </div>
            <div className='lb-row'>
              <div>Name</div>
              <div>
                <input type='text' name='attendeeName' value={this.state.attendeeName} onChange={this.handleChange} className={this.state.attendeeName_class} placeholder='' autoComplete='off' maxLength='32' />
              </div>
            </div>
            <div className='lb-row'>
              <div>Time</div>
              <div>
                <input type='text' name='laptime' value={this.state.laptime} onChange={this.handleChange} className={this.state.laptime_class} placeholder='00:00.000' autoComplete='off' maxLength='9' />
              </div>
            </div>
            <div className='lb-row'>
              <div></div>
              <div>
                <div><label><input type='checkbox' name='forceUpdate' value='Y' checked={this.state.forceUpdate} onChange={this.handleCheckBox} className='checkbox' /> Force update</label></div>
                <div><label><input type='checkbox' name='forceDelete' value='Y' checked={this.state.forceDelete} onChange={this.handleCheckBox} className='checkbox' /> Force delete</label></div>
              </div>
            </div>
            <div className='lb-row'>
              <div></div>
              <div><button type='submit' className='btn-submit'>Save</button></div>
            </div>
          </div>
        </form>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
