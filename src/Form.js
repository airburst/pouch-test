import React, { Component } from 'react';

export default class Form extends Component {

  static propTypes = {
    addVisit: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = { 
      firstname: '',
      lastname: '',
      personId: '',
    }
  }

  updateFirstName = (e) => {
    this.setState({ firstname: e.target.value });
  }

  updateLastName = (e) => {
    this.setState({ lastname: e.target.value });
  }

  updatePersonId = (e) => {
    this.setState({ personId: e.target.value });
  }

  reset() {
    this.setState({ 
      firstname: '',
      lastname: '',
      personId: '',
    })
  }

  render() {
    return (
      <div>
        <div className="form-row">
          <label className="label">First name</label>
          <input type="text" value={this.state.firstname} onChange={this.updateFirstName} />
        </div>
        <div className="form-row">
          <label className="label">Surname</label>
          <input type="text" value={this.state.lastname} onChange={this.updateLastName} />
        </div>
        <div className="form-row">
          <label className="label">Person Id</label>
          <input type="text" value={this.state.personId} onChange={this.updatePersonId} />
        </div>
        <div className="form-row">
          <label className="label"></label>
          <button onClick={this.props.addVisit.bind(null,this.state)}>Add Person</button>
        </div>
      </div>
    )
  }

}
