import React, { Component } from 'react'
import Form from './Form'
import { PouchService } from './services/pouchService'
import { hexEncode } from './services/hexEncoder'

//const visits = new PouchService('visits', 'http://51.254.135.229:5984')
let username = 'bob'
let visits = new PouchService('userdb-' + hexEncode(username), 'http://bob:password@localhost:5984')

// Handle error if database does not exist?  Auth would fail first

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

  completeVisit = (record) => {
    let completedRecord = Object.assign({}, record, { status: 'completed' })
    visits.update(completedRecord).then(result => console.log('Completed Visit', result))
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
          <span className="visit-complete">
            <button onClick={() => { this.completeVisit(v) } }>Complete</button>
          </span>
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
