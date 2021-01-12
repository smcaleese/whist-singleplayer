import '../Game.scss'
import React from 'react'
import ScoreBoard from './ScoreBoard'
import ContinuousSlider from './Slider'

class Header extends React.Component {
    handleValueChange = (newValue) => {
        this.props.newValue(newValue)
    }
    render() {
        const state = this.props.state
        const game = state.game
        const teams = game.teams
        const player_id = state.player_id
        const playerTeamId = state.game.players[player_id].teamId
        const otherTeamId = teams[playerTeamId].otherTeamId

        const messageList = Object.values(game.messages).map((message) =>
            <li>{message}</li>
        )
        let header
        if(state.gameRunning) {
            header = (
                <div className="header">
                    <ScoreBoard type="tricks" v1={teams[playerTeamId].tricks} v2={teams[otherTeamId].tricks} />
                    <div className="center2">
                        <ul>
                            {messageList}
                        </ul>
                    </div>
                    <ScoreBoard type="score" v1={teams[playerTeamId].score} v2={teams[otherTeamId].score} />
                </div>
            )
            return header
        } else {
            return null
        }
    }
}

export default Header