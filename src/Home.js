import React from 'react'
import {
    BrowserRouter as Router,
        Switch,
        Route,
        Link
      } from "react-router-dom";
import './Home.scss'

class App extends React.Component {
    render() {
        return (
            <div className="app center">
                <div className="home center">
                    <div className="logo">
                        <img src={"/logo.png"} alt="logo" />
                    </div>
                    <button className="button">
                        <Link to="/singleplayer-game" className="link">Singleplayer</Link>
                    </button>
                </div>
            </div>
        )
    }
}

export default App