import React from 'react'
import {
    BrowserRouter as Router,
        Switch,
        Route,
        Link
      } from "react-router-dom";
import SinglePlayerGame from './SinglePlayerGame'
import Home from './Home'

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/singleplayer-game" component={SinglePlayerGame} />
                </Switch>
            </Router>
        )
    }
}

export default App

