import React, { Component } from 'react';
import './License.css';
import LicenseView from './LicenseView';
import fetchMock from 'fetch-mock/es5/server';

fetchMock.mock(
  '/license',
  new Promise((resolve) => {
    setTimeout(
      () => {resolve('MIT')},
      800
    )
  })
)

class License extends Component {
  constructor() {
    super();
  
    this.state = {
      license: '<fetching...>'
    };

    this.fetchLicense = this.fetchLicense.bind(this);
  }

  fetchLicense() {
    let _this = this;
    return fetch('/license').then((response) => {
      _this.setState({
        license: response.body
      })
    }).catch((error) => {
      _this.setState({
        license: '<Unable to fetch license: ' + error.message + '>'
      })
    });
  }

  componentDidMount() {
    this.fetchLicense();
  }

  render() {
    return <LicenseView license={this.state.license} />;
  }
}

export default License;
