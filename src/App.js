import React, { Component } from 'react';
import { visits } from './services/visits';

export default class App extends Component {
  
	init() {
        visits.fetchAll().then(v => { this.showVisits(v) })
        visits.sync()
    }

    showVisits(visitsList) {
        console.log(visitsList)
    }
  
	  render() {
		return (
		  <h1>Hello, world.</h1>
		);
	  }
  
}
