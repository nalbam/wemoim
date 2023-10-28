import React, { Component, Fragment } from 'react';
import { useNavigate } from 'react-router-dom'

import { API } from 'aws-amplify'

import AttendeeItem from './AttendeeItem';

function withNavigate(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}

class App extends Component {
  state = {
    logo: '/images/blank.png',
    title: '',
    status: '',
    items: [],
  }

  componentDidMount() {
    this.getMoim();
    this.getAttendees();
    this.intervalId = setInterval(this.getAttendees.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getMoim = async () => {
    if (!this.props.moim_id || this.props.moim_id === 'undefined') {
      return;
    }

    try {
      console.log(`getMoim: ${this.props.moim_id}`);

      const res = await API.get('moims', `/items/my/${this.props.moim_id}`);

      // console.log(`getMoim: ${JSON.stringify(res, null, 2)}`);

      this.setState({
        moim_id: res.moim_id,
        logo: res.logo,
        title: res.title,
        desc: res.desc,
        questions: res.questions,
        date_start: res.date_start,
        date_end: res.date_end,
      });
    } catch (err) {
      console.log(`getMoim: ${JSON.stringify(err.message, null, 2)}`);

      this.props.navigate(`/manage/`);
    }
  };

  getAttendees = async () => {
    const res = await API.get('attendees', `/items/${this.props.moim_id}`);
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare);

    let attendance = items.filter(item => item.attendance === true).length;
    let received = items.filter(item => item.received === true).length;

    this.setState({
      items: items,
      status: `신청: ${items.length} / 참석: ${attendance} / 수령: ${received}`
    });
  }

  compare(a, b) {
    let a1 = a.name;
    let b1 = b.name;
    if (a1 < b1) {
      return -1;
    } else if (a1 > b1) {
      return 1;
    }
    return 0;
  }

  render() {
    const { selectAttendee } = this.props;

    const attendeeList = this.state.items.map(
      (item, index) => (<AttendeeItem key={index} item={item} selectAttendee={selectAttendee} />)
    );

    return (
      <Fragment>
        <div className='lb-left'>
          <div className='logo'>
            <img id='logo' src={this.state.logo} alt='logo' />
          </div>

          <div className='info'>{this.state.title}</div>

          <div className='info'>{this.state.status}</div>

          <div className='lb-header'>
            <div></div>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
          </div>
          {attendeeList}
        </div>
      </Fragment>
    );
  }
}

export default withNavigate(App);
