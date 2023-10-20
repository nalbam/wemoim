import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Popup from './Popup';

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    id: '',
    id_class: 'text_normal',
    id_ro: false,
    logo: '',
    logo_class: 'text_normal width_80',
    title: '',
    title_class: 'text_normal width_80',
    desc: '',
    desc_class: 'text_normal width_80',
    questions: '',
    questions_class: 'text_normal width_80',
    date_start: '',
    date_start_class: 'text_normal',
    date_end: '',
    date_end_class: 'text_normal',
  }

  logos = [
    { url: 'https://wemoim.com/images/wemoim.png' },
  ]

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

    if (res && res.id) {
      this.setState({
        id_ro: true,
        id: res.id,
        logo: res.logo,
        title: res.title,
        desc: res.desc,
        questions: res.questions,
        date_start: res.date_start,
        date_end: res.date_end,
      });

      this.validateAll();
    }
  };

  postMoim = async () => {
    console.log('postMoim');

    try {
      let body = {
        id: this.state.id,
        logo: this.state.logo,
        title: this.state.title,
        desc: this.state.desc,
        questions: this.state.questions,
        date_start: this.state.date_start,
        date_end: this.state.date_end,
      };

      console.log(`postMoim: ${JSON.stringify(body, null, 2)}`);

      const res = await API.post('moims', '/items', {
        body: body
      });

      console.log(`postMoim: ${JSON.stringify(res, null, 2)}`);

      // this.popup('Saved!');
      this.popupCmp.current.start(3000, 'Saved!');

      if (!this.props.moim_id) {
        this.setState({
          id: '',
          logo: '',
          title: '',
          desc: '',
          questions: '',
          date_start: '',
          date_end: '',
        });

        // TODO - redirect to moim page
        // this.props.history.push(`/manage/moim/${this.state.id}`);
      }
    } catch (err) {
      console.log(`postMoim: ${JSON.stringify(err, null, 2)}`);

      // this.popup(err.message);
      this.popupCmp.current.start(3000, err.message);
    }
  };

  testId(val) {
    var re = /^([a-z][a-z0-9-_]{4,54})$/g;
    return re.test(val);
  }

  testUrl(val) {
    var re = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/g;
    return re.test(val);
  }

  testDate(val) {
    var re = /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/;
    return re.test(val);
  }

  testDateTime(val) {
    var re = /^([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2})$/;
    return re.test(val);
  }

  getClassValue(b, v) {
    if (b) {
      return `text_normal ${v}`;
    } else {
      return `text_red ${v}`;
    }
  }

  validateId(v) {
    let b = (v !== '' && this.testId(v));
    this.setState({
      moim_class: this.getClassValue(b),
    });
    return b;
  }

  validateLogo(v) {
    let b = (v !== '' && this.testUrl(v));
    this.setState({
      logo_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateTitle(v) {
    let b = (v !== '');
    this.setState({
      title_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateDateStart(v) {
    let b = (v === '' || this.testDate(v));
    this.setState({
      date_start_class: this.getClassValue(b),
    });
    return b;
  }

  validateDateEnd(v) {
    let b = (v === '' || this.testDate(v));
    this.setState({
      date_end_class: this.getClassValue(b),
    });
    return b;
  }

  validateAll() {
    let b = true;
    b = b && this.validateId(this.state.id);
    b = b && this.validateLogo(this.state.logo);
    b = b && this.validateTitle(this.state.title);
    b = b && this.validateDateStart(this.state.date_start);
    b = b && this.validateDateEnd(this.state.date_end);
    return b;
  }

  validate(k, v) {
    let b = false;
    switch (k) {
      case 'id':
        b = this.validateId(v);
        break;
      case 'logo':
        b = this.validateLogo(v);
        break;
      case 'title':
        b = this.validateTitle(v);
        break;
      case 'date_start':
        b = this.validateDateStart(v);
        break;
      case 'date_end':
        b = this.validateDateEnd(v);
        break;
      default:
    }
    return b;
  }

  handleChange = (e) => {
    let v = e.target.value;

    switch (e.target.name) {
      case 'id':
        v = v.replace(/[^a-z0-9-_]/g, '');
        break;
      case 'logo':
        document.getElementById('logo').src = v;
        break;
      // case 'title':
      //   document.getElementById('title').innerText = v;
      //   break;
      default:
    }

    this.setState({
      [e.target.name]: v,
    });

    this.validate(e.target.name, v);
  }

  handleLogo = (e) => {
    this.setState({
      logo: e.target.src
    });

    document.getElementById('logo').src = e.target.src;
  }

  handleChangeTZ = (v) => {
    this.setState({
      dateTZ: v,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateAll()) {
      return;
    }

    this.postMoim();
  }

  render() {
    const logoList = this.logos.map(
      (item, index) => (<img key={index} src={item.url} onClick={this.handleLogo} alt='logo' className='icon-logo' />)
    );

    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className='lb-submit'>
            <div className='lb-row'>
              <div>Id</div>
              <div>
                <input type='text' name='id' value={this.state.id} onChange={this.handleChange} className={this.state.id_class} readOnly={this.state.id_ro} placeholder='Only lowercase letters and numbers and -_' autoComplete='off' maxLength='64' />
              </div>
            </div>
            <div className='lb-row'>
              <div>로고</div>
              <div>
                <input type='text' name='logo' value={this.state.logo} onChange={this.handleChange} className={this.state.logo_class} placeholder='Logo uri, including http:// or https://' autoComplete='off' maxLength='256' />
                {logoList}
              </div>
            </div>
            <div className='lb-row'>
              <div>주제</div>
              <div>
                <input type='text' name='title' value={this.state.title} onChange={this.handleChange} className={this.state.title_class} placeholder='' autoComplete='off' maxLength='128' />
              </div>
            </div>
            <div className='lb-row'>
              <div>설명</div>
              <div>
                <input type='text' name='desc' value={this.state.desc} onChange={this.handleChange} className={this.state.desc_class} placeholder='' autoComplete='off' maxLength='9000' />
              </div>
            </div>
            <div className='lb-row'>
              <div>시작일</div>
              <div>
                <input type='text' name='date_start' value={this.state.date_start} onChange={this.handleChange} className={this.state.date_start_class} placeholder='2023-01-01' autoComplete='off' maxLength='10' />
              </div>
            </div>
            <div className='lb-row'>
              <div>종료일</div>
              <div>
                <input type='text' name='date_end' value={this.state.date_end} onChange={this.handleChange} className={this.state.date_end_class} placeholder='2023-01-01' autoComplete='off' maxLength='10' />
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
