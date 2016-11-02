import React, { Component } from 'react'
import Form from './Form'
import { visits } from './services/visits'

export default class App extends Component {

  static propTypes = {
    name: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      visits: [],
      selectedPerson: {
        firstname: '',
        lastname: '',
        personId: ''
      }
    }
  }

  componentDidMount() {
    this.updateVisitsList()
    visits.subscribe(this.handleChange)
    visits.sync()
  }

  componentWillUnmount() {
    visits.unsubscribe()
  }

  handleChange = (changes) => {
    this.updateVisitsList()
    // console.log(changes.doc)
  }

  updateVisitsList() {
    visits.fetchAll().then(data => {
      this.setState({ visits: data.map(v => { return v.doc }) })
    })
  }

  addVisit = (person) => {
    visits.add(person).then(result => console.log('Added Visit', result))
  }

  removeVisit = (id) => {
    visits.remove(id).then(result => console.log('Removed Visit', result))
  }

  changeVisit = (doc) => {
    visits.update(doc).then(result => console.log('Updated Visit', result))
  }

  selectPerson(person) {
    console.log(person)
    this.setState({ selectedPerson: person })
  }

  render() {
    let visitList = this.state.visits.map((v) => {
      return (
        <div key={v._id} className="visit-row" onClick={() => { this.selectPerson(v) } }>
          <span className="visit-id">{v.personId}</span>
          <span className="visit-name">{v.firstname} {v.lastname}</span>
          <span className="fill"></span>
          <span className="visit-remove">
            <button onClick={() => { this.removeVisit(v._id) } }>Remove</button>
          </span>
        </div>
      )
    })

    return (
      <div>
        <h1>Visits</h1>
        {visitList}
        <Form
          person={this.state.selectedPerson}
          addVisit={this.addVisit}
          changeVisit={this.changeVisit}/>
      </div>
    )
  }

}

          // <span className="visit-change">
          //   <button onClick={() => { this.changeVisit(v) } }>Change</button>
          // </span>