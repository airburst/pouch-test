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

  addPerson = (person) => {
    visits.add(person)
  }

  render() {
    let visitList = this.state.visits.map((v) => {
      return (
        <div key={v._id}>
          <p>{v.personId} : {v.firstname} {v.lastname}</p>
        </div>
      )
    })

    return (
      <div>
        <h1>Visits</h1>
        {visitList}
        <hr />
        <Form addPerson={this.addPerson}/>
      </div>
    )
  }

}
