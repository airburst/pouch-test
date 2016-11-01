import React, { Component } from 'react'
import Form from './Form'
import { visits } from './services/visits'

export default class App extends Component {

  static propTypes = {
    name: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = { visits: [] };
  }

  componentDidMount() {
    visits.fetchAll().then(visitData => {
      this.setState({ visits: visitData.map(v => { return v.doc }) })
    })
    visits.sync()
  }

  addVisit = (person) => {
    visits.add(person).then(result => console.log('Added Visit', result))
  }

  removeVisit = (id) => {
    visits.remove(id).then(result => console.log('Removed Visit', result))    // Issue: auto-removing
  }

  render() {
    let visitList = this.state.visits.map((v) => {
      return (
        <div key={v._id}>
          <p>{v.personId} : {v.firstname} {v.lastname} <button onClick={this.removeVisit(v._id)}>Remove</button></p>
        </div>
      )
    })

    return (
      <div>
        <h1>Visits</h1>
        {visitList}
        <hr />
        <Form addVisit={this.addVisit}/>
      </div>
    )
  }

}
