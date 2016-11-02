import React, { Component } from 'react';

export default class Form extends Component {

  static propTypes = {
    addVisit: React.PropTypes.func,
    person: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      person: this.props.person,
      mode: 'add'
    }
  }

  componentWillUpdate(nextProps) {
    if (JSON.stringify(nextProps.person) !== JSON.stringify(this.props.person)) {
      this.setState({
        person: nextProps.person,
        mode: 'change'
      })
    }
  }

  updateFirstName = (e) => {
    let p = Object.assign({}, this.state.person, { firstname: e.target.value })
    this.setState({ person: p})
  }

  updateLastName = (e) => {
    let p = Object.assign({}, this.state.person, { lastname: e.target.value })
    this.setState({ person: p})
  }

  updatePersonId = (e) => {
    let p = Object.assign({}, this.state.person, { personId: e.target.value })
    this.setState({ person: p})
  }

  reset = () => {
    this.setState({
      person: {
        firstname: '',
        lastname: '',
        personId: '',
        _id: '',
        _rev: ''
      },
      mode: 'add'
    })
  }

  render() {
    const Button = (this.state.mode === 'add')
      ? (<button className="btn" onClick={this.props.addVisit.bind(null, this.state.person)}>Add Person</button>)
      : (<button className="btn" onClick={this.props.changeVisit.bind(null, this.state.person)}>Change Person</button>)
    
    return (
      <div className="form-container">
        <div className="form-row">
          <label className="label">First name</label>
          <input type="text" value={this.state.person.firstname} onChange={this.updateFirstName} />
        </div>
        <div className="form-row">
          <label className="label">Surname</label>
          <input type="text" value={this.state.person.lastname} onChange={this.updateLastName} />
        </div>
        <div className="form-row">
          <label className="label">Person Id</label>
          <input type="text" value={this.state.person.personId} onChange={this.updatePersonId} />
        </div>
        <div className="form-row">
          <label className="label"></label>
          {Button}
          <button className="btn" onClick={this.reset}>Clear</button>
        </div>
      </div>
    )
  }

}
