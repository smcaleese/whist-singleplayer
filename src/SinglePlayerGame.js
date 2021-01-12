import './Game.scss'
import React from 'react'
import Header from './components/Header'
import Player from './components/Player'
import MiddleCard from './components/MiddleCard'
import ContinuousSlider from './components/Slider'
import socketIOClient from 'socket.io-client'
const SOCKET_SERVER_URL = "http://localhost:4000"
let socket

class SinglePlayerGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }
    componentDidMount() {
        socket = socketIOClient(SOCKET_SERVER_URL)
        socket.on("connect", () => {
            socket.emit("enter game", "singleplayer")
        })
        socket.on("reset", (game) => {
            this.setState({game})
            socket.emit("enter game", "singleplayer")
        })
        socket.on("init", ( [player_id, game]) => {
            this.setState({player_id, game, loading: false})
        })
        socket.on("start game", (game, player_id) => {
            this.setState({game, gameRunning: true})
        })
        socket.on("run ai", () => {
            socket.emit("run ai")
        })
        socket.on("update client", (game) => {
            this.setState({game})
        })
        socket.on("update players", (game) => {
            this.setState({game})
        })
        socket.on("end of trick", (game) => {
            this.setState({game})
            socket.emit("end of trick")
        })
        socket.on("game finished", (winner_id) => {
            this.setState({gameFinished: true, winner_id, gameRunning: false})
        })
    }
    playCard = (index, card, position) => {
        if(position !== "bottom") {
            return
        }
        let {game} = this.state
        let {player_id} = this.state
        if(game.players[player_id].state !== "PLAY") {
            console.log("not your turn")
            return
        }
        socket.emit("card played", [index, card])
    }
    updateSpeed = (value) => {
        const newSpeed = value
        this.setState(prevState => {
            let game = prevState.game
            game.speed = value
            return { game }
        })
        socket.emit("update speed", this.state.game.speed)
    }
    render() {
        if(this.state.loading) {
            return null
        }
        if(this.state.gameFinished) {
            const state = this.state
            const teams = state.game.teams
            if(state.winner_id === state.game.players[state.player_id].teamId) {
                return (
                    <div className="game-finished-message center2" style={{"backgroundColor": "#26d426"}}>
                        <h1>Your team won the game! &#128516;</h1>
                    </div>
                )
            } else {
                return (
                    <div className="game-finished-message center2" style={{"backgroundColor": "#df1d1d"}}>
                        <h1>Your team lost the game &#128528;</h1>
                    </div>
                )
            }
        }
        const state = this.state
        const game = this.state.game
        const positions = [[1, "bottom", "you"], [2, "left", "opponent 1"],
            [3, "top", "team mate"], [4, "right", "opponent 2"]];
        const middleCards = positions.map((position) =>
            <MiddleCard state={state} playerId={position[0]} position={position[1]} />
        )
        const players = positions.map((position) =>
            <Player playerId={position[0]} position={position[1]}
                name={position[2]} state={state} playCard={this.playCard} />
        )
        return (
            <div className="game">
                <Header state={this.state} messages={this.state.game.messages} newValue={this.updateSpeed} />
                <ContinuousSlider value={game.speed} newValue={this.updateSpeed} />
                <div className="middle-area">
                    {middleCards}
                </div>
                {players}
            </div>
        )
    }
}

export default SinglePlayerGame;