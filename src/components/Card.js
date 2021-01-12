import '../Game.scss'
import React from 'react'

class Card extends React.Component {
    render() {
        const cardStyle = {
            "marginLeft": `${this.props.left * 30}px`,
            "zIndex": `${this.props.left}`
        };
        const cardType = this.props.type
        return (
            <div className="card" style={cardStyle} onClick={this.props.onClick}>
                <img src={`/cards/${cardType}.svg`} alt="card" />
            </div>
        )
    }
}

export default Card