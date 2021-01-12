import '../Game.scss'
import React from 'react'
import Cards from './Cards'

class Player extends React.Component {
    handleClick = (index, card, position) => {
        this.props.playCard(index, card, position)
    }
    render() {
        const state = this.props.state
        const game = state.game
        const yourPlayerId = state.player_id
        const playerId = this.props.playerId
        const playerData = game.players[playerId]
        let player
        if(playerData.state === "EMPTY" || state.gameFinished) {
            player = (<div className="empty-div"></div>)
            return player
        }
        const position = this.props.position
        let style = {}
        if(position === "left" || position === "right") {
            style = {
                "height": `${playerData.currentHand.length*1.5}rem`
            }
        }
        // don't show opponents' cards:
        const currentHand = game.players[playerId].currentHand
        let cards
        if(playerId !== yourPlayerId) {
            cards = Array.from(Array(currentHand.length), () => "2B")
        } else {
            cards = currentHand
        }
        player = (
            <div className={`player-${position}`}>
                <div className="player-name">
                    <p>{this.props.name}</p>
                </div>
                <div className="player-cards" style={style}>
                    <Cards cards={cards} playCard={this.handleClick} position={position} />
                </div>
            </div>
        )
        return player
    }
}

export default Player