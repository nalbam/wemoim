import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import MoimItem from './MoimItem';

class App extends Component {
  state = {
    items: [],
  }

  componentDidMount() {
    this.getMoims();
  }

  getMoims = async () => {
    const res = await API.get('moims', '/items');
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare).reverse();

    this.setState({ items: items });
  }

  compare(a, b) {
    let a1 = a.registered;
    let b1 = b.registered;
    if (a1 < b1) {
      return -1;
    } else if (a1 > b1) {
      return 1;
    }
    return 0;
  }

  render() {
    const moimList = this.state.items.map(
      (item, index) => (<MoimItem key={index} item={item} pathPrefix={this.props.pathPrefix} />)
    );

    return (
      <Fragment>
        <div className='lb-items'>
          <div className='lb-header lb-rank0'>
            <div>Logo</div>
            <div>Title</div>
            <div>Date</div>
          </div>
          {moimList}
        </div>
      </Fragment>
    );
  }
}

export default App;
