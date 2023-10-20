import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Popup from './Popup';

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    defaultLogo: false,
    logo_class: 'text_normal width_80',
    logo: '',
    title_class: 'text_normal width_80',
    title: '',
    moim_class: 'text_normal width_80',
    moim_read: false,
    moim: '',
  }

  logos = [
    { url: 'https://wemoim.com/images/wemoim.png' },
  ]

  componentDidMount() {
    this.getMoim();
  }

  getMoim = async () => {
    if (!this.props.moim || this.props.moim === 'undefined') {
      return;
    }

    console.log(`getMoim: ${this.props.moim}`);

    const res = await API.get('moims', `/items/object/${this.props.moim}`);

    console.log(`getMoim: ${JSON.stringify(res, null, 2)}`);

    if (res && res.moim) {
      this.setState({
        logo: res.logo,
        moim: res.moim,
        title: res.title,
        moim_read: true,
      });

      this.validateAll();
    }
  };

  postMoim = async () => {
    console.log('postMoim');

    try {
      let body = {
        logo: this.state.logo,
        moim: this.state.moim,
        title: this.state.title,
      };

      console.log(`postMoim: ${JSON.stringify(body, null, 2)}`);

      const res = await API.post('moims', '/items', {
        body: body
      });

      console.log(`postMoim: ${JSON.stringify(res, null, 2)}`);

      // this.popup('Saved!');
      this.popupCmp.current.start(3000, 'Saved!');

      if (!this.props.moim) {
        this.setState({
          logo: '',
          moim: '',
          title: '',
        });

        this.props.history.push(`/manage/moim/${this.state.moim}`);
      }
    } catch (err) {
      console.log(`postMoim: ${JSON.stringify(err, null, 2)}`);

      // this.popup(err.message);
      this.popupCmp.current.start(3000, err.message);
    }
  };

  validateString(val) {
    var re = /^([a-z][a-z0-9-_]{3,19})$/g;
    return re.test(val);
  }

  validateUrl(val) {
    var re = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/g;
    return re.test(val);
  }

  validateDate(val) {
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

  validateMoim(v) {
    let b = (v !== '' && this.validateString(v));
    this.setState({
      moim_class: this.getClassValue(v, 'width_80'),
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

  validateLogo(v) {
    let b = (v !== '' && this.validateUrl(v));
    this.setState({
      logo_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateDateClose(v) {
    let b = (v === '' || this.validateDate(v));
    this.setState({
      dateClose_class: this.getClassValue(b),
    });
    return b;
  }

  validateDateOpen(v) {
    let b = (v === '' || this.validateDate(v));
    this.setState({
      dateOpen_class: this.getClassValue(b),
    });
    return b;
  }

  validateAll() {
    let b = this.validateMoim(this.state.moim);
    b = this.validateTitle(this.state.title) && b;
    b = this.validateLogo(this.state.logo) && b;
    return b;
  }

  validate(k, v) {
    let b = false;

    switch (k) {
      case 'logo':
        b = this.validateLogo(v);
        break;
      case 'title':
        b = this.validateTitle(v);
        break;
      case 'moim':
        b = this.validateMoim(v);
        break;
      default:
    }

    return b;
  }

  handleChange = (e) => {
    let v = e.target.value;

    switch (e.target.name) {
      case 'logo':
        document.getElementById('logo').src = v;
        break;
      case 'title':
        document.getElementById('title').innerText = v;
        break;
      case 'moim':
        v = v.replace(/[^a-z0-9-_]/g, '');
        break;
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
              <div>Logo</div>
              <div>
                <input type='text' name='logo' value={this.state.logo} onChange={this.handleChange} className={this.state.logo_class} placeholder='Logo uri, including http:// or https://' autoComplete='off' maxLength='256' />
                {logoList}
              </div>
            </div>
            <div className='lb-row'>
              <div>Title</div>
              <div>
                <input type='text' name='title' value={this.state.title} onChange={this.handleChange} className={this.state.title_class} placeholder='' autoComplete='off' maxLength='64' />
              </div>
            </div>
            <div className='lb-row'>
              <div>Code</div>
              <div>
                <input type='text' name='moim' value={this.state.moim} onChange={this.handleChange} className={this.state.moim_class} readOnly={this.state.moim_read} placeholder='Only lowercase letters and numbers and -_' autoComplete='off' maxLength='20' />
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