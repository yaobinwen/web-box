import React, { Component } from 'react';
import './License.css';

class LicenseView extends Component {
  render() {
    return (
      <div className="License">
        <p key="license" className="License-entry">
          License: {this.props.license}
        </p>
      </div>
    );
  }
}

export default LicenseView;
