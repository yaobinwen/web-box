import React, { Component } from 'react';
import './About.css';

class AboutView extends Component {
  render() {
    return (
      <div className="About">
        <p key="author" className="About-entry">
          Author: {this.props.author}
        </p>
        <p key="description" className="About-entry">
          Description: {this.props.description}
        </p>
      </div>
    );
  }
}

export default AboutView;