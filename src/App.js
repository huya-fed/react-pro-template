import React, {Component} from 'react'
import classNames from 'classnames'

import Header from './components/Header.jsx'

class App extends Component {
    constructor() {
        super();

        this.state = {
            
        }
    }

    render() {
        return ( 
            <div>
                <Header name="hello world" />
            </div>    
        );
    }
}

export default App;