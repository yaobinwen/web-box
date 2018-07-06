import React, { Component } from 'react';
import './About.css';
import fetchMock from 'fetch-mock/es5/server';

fetchMock.mock(
  '/info/author',
  new Promise((resolve) => {
    setTimeout(
      () => { resolve('Yaobin Wen')},
      1000
    )
  })
).mock(
  '/info/description',
  new Promise((resolve) => {
    setTimeout(
      () => {resolve('Test async component')},
      500
    )
  })
)

class About extends Component {
  constructor() {
    super();
  
    this.state = {
      author: '<fetching...>',
      description: '<fetching...>'
    };

    this.updateAuthor = this.updateAuthor.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.fetchAuthor = this.fetchAuthor.bind(this);
    this.fetchDescription = this.fetchDescription.bind(this);
  }

  updateAuthor(name) {
    this.setState({
      author: name
    });
  }

  updateDescription(description) {
    this.setState({
      description: description
    });
  }

  fetchAuthor() {
    let _this = this;
    fetch('/info/author').then((response) => {
      _this.updateAuthor(response.body)
    }).catch((error) => {
      _this.updateAuthor(
        '<Unable to fetch author name: ' + error.message + '>'
      )
    });
  }

  fetchDescription() {
    let _this = this;
    fetch('/info/description').then((response) => {
      _this.updateDescription(response.body)
    }).catch((error) => {
      _this.updateDescription(
        '<Unable to fetch project description: ' + error.message + '>'
      )
    });
  }

  componentDidMount() {
    this.fetchAuthor();
    this.fetchDescription();
  }

  render() {
    return (
      <div className="About">
        <p key="author" className="About-entry">
          Author: {this.state.author}
        </p>
        <p key="description" className="About-entry">
          Description: {this.state.description}
        </p>
      </div>
    );
  }
}

export default About;
