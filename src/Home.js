import React from 'react'
import {
    BrowserRouter as Router,
        Switch,
        Route,
        Link
      } from "react-router-dom";
import './Home.scss'
import SinglePlayerGame from './SinglePlayerGame'

class App extends React.Component {
    render() {
        return (
            <div className="app center">
                <SinglePlayerGame />
            </div>
        )
    }
}

/*
<div className="home center">
                    <div className="logo">
                        <img src={"/logo.png"} alt="logo" />
                    </div>
                    <button className="button">
                        <Link to="/singleplayer-game" className="link">Singleplayer</Link>
                    </button>
                </div>
*/

export default App