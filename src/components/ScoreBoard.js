import '../Game.scss'
import React from 'react'

class ScoreBoard extends React.Component {
    render() {
        const pos = this.props.pos;
        return (
            <div className={`score-board-${pos} center2`}>
                <div className="score-board center2">
                    <div className="score">
                        <div>
                            <h2>{this.props.v1} </h2>
                            <p>{this.props.type}</p>
                        </div>
                        <div>
                            <h2>{this.props.v2} </h2>
                            <p>{this.props.type}</p>
                        </div>
                    </div>
                    <div className="team-names">
                        <p style={{"color":"red"}}>your team</p>
                        <p style={{"color":"blue"}}>other team</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default ScoreBoard