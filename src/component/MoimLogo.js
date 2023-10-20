import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Logo from './Logo';

class App extends Component {
  constructor(props) {
    super(props);

    this.logoCmp = React.createRef();
  }

  state = {
    logo: '/images/icon-trophy.png',
    title: '',
    dateClose: '',
    dateOpen: '',
    timeZone: '',
    pop: false,
  }

  componentDidMount() {
    this.getMoim();
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('mousedown', this.handleMouse);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('mousedown', this.handleMouse);
  }

  getMoim = async () => {
    if (!this.props.moim || this.props.moim === 'undefined') {
      return;
    }

    console.log(`getMoim ${this.props.moim}`);

    const res = await API.get('moims', `/items/object/${this.props.moim}`);
    if (res && res.moim) {
      this.setState({
        logo: res.logo,
        title: res.title,
        dateClose: res.dateClose,
        dateOpen: res.dateOpen,
        timeZone: res.timeZone,
      });
    }
  };

  handleKey = (e) => {
    console.log(`handleKey ${e.keyCode}`);

    if (!this.state.pop && e.keyCode === 13) {
      this.setState({
        pop: true,
      });
      this.tada();
    }
  }

  handleMouse = (e) => {
    console.log(`handleMouse ${e.button}`);

    if (!this.state.pop && e.button === 0) {
      this.setState({
        pop: true,
      });
      this.tada();
    }
  }

  tada() {
    this.logoCmp.current.start(3500);

    setTimeout(
      function () {
        this.setState({
          pop: false,
        });
      }.bind(this), 9000
    );
  }

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='logo' />
        </div>
        <h1 id='title' className='title'>
          {this.state.title}
        </h1>

        <Logo ref={this.logoCmp} logo={this.state.logo} title={this.state.title} />
      </Fragment>
    );
  }
}

export default App;
