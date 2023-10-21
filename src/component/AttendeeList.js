import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import AttendeeItem from './AttendeeItem';

class App extends Component {
  state = {
    items: [],
  }

  componentDidMount() {
    this.getAttendees();
    this.intervalId = setInterval(this.getAttendees.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getAttendees = async () => {
    const res = await API.get('attendees', `/items/${this.props.moim_id}`);
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare);

    this.setState({ items: items });
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

export default App;
