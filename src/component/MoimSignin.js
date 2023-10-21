import React, { Component, Fragment } from 'react';
import { useNavigate } from 'react-router-dom'

import { API } from 'aws-amplify'

import Popup from './Popup';

function withNavigate(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    logo: '/images/wemoim.png',
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
        msg_signin: res.msg_signin,
      });
    }
  };

  postSignin = async () => {
    try {
      let body = {
        moim_id: this.props.moim_id,
        email: this.state.email,
      };

      console.log(`postSignin: ${JSON.stringify(body, null, 2)}`);

      const res = await API.get('attendees', `/items/object/${this.props.moim_id}/${this.state.email}`);

      // console.log(`postSignin: ${JSON.stringify(res, null, 2)}`);

      if (res && res.phone && res.phone === this.state.phone) {
        console.log(`postSignin: mathced ${res.attendee_id}`);

        // this.popupCmp.current.start(res.attendee_id);

        this.props.navigate(`/card/${res.attendee_id}`);
      } else {
        console.log(`postSignin: not mathced.`);

        this.popupCmp.current.start("일치하는 정보가 없습니다.");
      }
    } catch (err) {
      console.log(`postSignin: ${JSON.stringify(err.message, null, 2)}`);

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
    b = b && this.validateEmail(this.state.email);
    b = b && this.validatePhone(this.state.phone);
    return b;
  }

  validate(k, v) {
    let b = false;
    switch (k) {
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
    let v = e.target.value;

    this.setState({
      [e.target.name]: v,
    });

    this.validate(e.target.name, v);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateAll()) {
      return;
    }

    this.postSignin();
  }

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>

        <form onSubmit={this.handleSubmit}>
          <div className='lb-submit'>
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
              <div></div>
              <div><button type='submit' className='btn-submit'>등록정보 찾기</button></div>
            </div>
          </div>
        </form>

        <div className='desc'>
          <p>{this.state.msg_signin}</p>
        </div>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default withNavigate(App);
