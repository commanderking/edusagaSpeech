import React, { Component } from 'react';

class AccessCodeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInputCode: "",
      wrongAccessCode: false
    }
  }
  onFormSubmit(event) {
    event.preventDefault();
    if (!this.props.checkCode(this.state.userInputCode)) {
      this.setState({
        wrongAccessCode: true,
        userInputCode: ""
      });
    };
  }

  onCodeChange(event) {
    console.log(event.target.value);
    if (this.state.wrongAccessCode == true) {
      this.setState({
        userInputCode: event.target.value,
        wrongAccessCode: false
      });

    } else {
      this.setState({ userInputCode: event.target.value });
    }
  }

  render() {
    let errorDiv = this.state.wrongAccessCode ?
    <div className="alert alert-danger">Incorrect Access Code</div>
      : null;
    return (
      <div className="container access-code-form">
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <div className="form-group row">
            <label className="col-form-label">Access Code: </label>
            <div>
              <input value={this.state.userInputCode} onChange={this.onCodeChange.bind(this)} type="text" className="form-control">
              </input>
            </div>
          </div>
          {errorDiv}
          <div className="form-group row">
            <button type="submit" className="btn btn-primary">Enter Code</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AccessCodeForm;
