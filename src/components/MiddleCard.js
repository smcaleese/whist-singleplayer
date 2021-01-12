import '../Game.scss'
import React from 'react'
import Card from './Card'

class MiddleCard extends React.Component {
    render() {
        const state = this.props.state
        const game = state.game
        const playerId = this.props.playerId
        const position = this.props.position
        let middleCard
        if(game.players[playerId].state === "EMPTY" || state.gameFinished) {
            middleCard = null
        }
        else if(game.players[playerId].state === "WAITING") {
            middleCard = (
                <div className={`card-${position} center1`}>
                    <Card type={"blank"} />
                </div>
            )
        }
        else if(game.players[playerId].state === "PLAY") {
            middleCard = (
                <div className={`card-${position} center1`}>
                    <Card type={"1B"} />
                </div>
            )
        } else if(game.players[playerId].state === "PLAYED") {
            middleCard = (
                <div className={`card-${position} center1`}>
                    <Card type={game.players[playerId].currentCard} />
                </div>
            )
        }
        return middleCard
    }
}

export default MiddleCard