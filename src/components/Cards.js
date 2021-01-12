import '../Game.scss'
import React from 'react'
import Card from './Card'

class Cards extends React.Component {
    render() {
        const yourCards = this.props.cards
        const position = this.props.position
        const cards = yourCards.map((card, index) =>
            <Card type={card} left={index} key={index}
                onClick={() => {this.props.playCard(index, card, position)} } />
        )
        return (
            <div className="card-list">
                {cards}
            </div>
        )
    }
}

export default Cards