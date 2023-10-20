import React, { Component, Fragment } from 'react';

class App extends Component {

  state = {
    qr: `https://qr.nalbam.com/qr.png?body=https://wemoim.com/`,
  }

  componentDidMount() {
    this.getQR();
  }

  getQR = async () => {
    if (!this.props.moim_id || this.props.moim_id === 'undefined') {
      return;
    }

    this.setState({
      qr: `https://qr.nalbam.com/qr.png?body=https://wemoim.com/moim/${this.props.moim_id}`,
    });
  };

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='qr' src={this.state.qr} alt='qr' />
        </div>
      </Fragment>
    );
  }
}

export default App;
