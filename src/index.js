import {visits} from './services/visits';

class Main {

    constructor() {}

    init() {
        // Display list of visits
    }

    test() {
        // Add a test user
        visits.add({ name: 'Mark', personId: 'P123456' })
    }

}

let main = new Main()

main.test()