import React, { Component } from 'react'
import Form from './Form'
import { PouchService } from './services/pouchService'
import { hexEncode } from './services/hexEncoder'

const username = 'bob'
const password = 'password'
const database = () => { return `userdb-${hexEncode(username)}` }
const remoteUrl = () => { return `http://couchdb.fairhursts.net:5984` }

let visitsService = new PouchService(database(), remoteUrl(), username, password)

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
        visitsService.auth()
        visitsService.subscribe(this.handleChange)
        visitsService.sync()
            .then(result => { console.log(result) })
            .catch(err => { console.log(err) })
    }

    componentWillUnmount() {
        visitsService.unsubscribe()
    }

    handleChange = (changes) => {
        this.updateVisitsList()
    }

    updateVisitsList() {
        visitsService.fetchAll().then(data => {
            this.setState({ visits: data.map(v => { return v.doc }) })
        })
    }

    addVisit = (person) => {
        visitsService.add(person).then(result => console.log('Added Visit', result))
    }

    removeVisit = (id) => {
        visitsService.remove(id).then(result => console.log('Removed Visit', result))
    }

    completeVisit = (record) => {
        let completedRecord = Object.assign({}, record, { status: 'completed' })
        visitsService.update(completedRecord).then(result => console.log('Completed Visit', result))
    }

    changeVisit = (doc) => {
        visitsService.update(doc).then(result => console.log('Updated Visit', result))
    }

    selectPerson(person) {
        console.log(person)
        this.setState({ selectedPerson: person })
    }

    render() {
        let visitList = this.state.visits.map((v) => {
            let completed = (v.status === 'completed')
            let rowClass = (completed) ? "visit-row completed" : "visit-row"
            return (
                <div
                    key={v._id}
                    className={rowClass}
                    onClick={() => { this.selectPerson(v) } }
                    >
                    <span className="visit-id">{v.personId}</span>
                    <span className="visit-name">{v.firstname} {v.lastname}</span>
                    <span className="fill"></span>
                    {(!completed) ?
                        <div>
                            <span className="visit-complete">
                                <button onClick={() => { this.completeVisit(v) } }>Complete</button>
                            </span>
                            <span className="visit-remove">
                                <button onClick={() => { this.removeVisit(v._id) } }>Remove</button>
                            </span>
                        </div>
                        : null}
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
                    changeVisit={this.changeVisit} />
            </div>
        )
    }

}
