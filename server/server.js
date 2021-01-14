const express = require('express')
const app = express();
const socketio = require('socket.io')
const http = require('http').createServer()
const path = require('path')

const APP_PORT = 4000
const SOCKET_PORT = 5000

const io = socketio(http, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

app.use(express.static(path.join(__dirname, '..', 'build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

app.listen(APP_PORT, () => {
    console.log(`app listening on port ${APP_PORT}`)

})

http.listen(SOCKET_PORT, () => {
    console.log(`socketio listening on port ${SOCKET_PORT}`)
})

let game = {}
const deck = ["2H", "3H", "4S", "6C", "7D", "8H", "9S", "KC", "QD", "TH",
    "3S", "5C", "6D", "7H", "8S", "AC", "JC", "KD", "QH", "TS",
    "2S", "4C", "5D", "6H", "7S", "9C", "AD", "JD", "KH", "QS",
    "2C", "3C", "4D", "5H", "6S", "8C", "9D", "AH", "JH", "KS", "TC",
    "2D", "3D", "4H", "5S", "7C", "8D", "9H", "AS", "JS", "QC", "TD"]
const cardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
const suits = {
    "H": "hearts",
    "D": "diamonds",
    "C": "clubs",
    "S": "spades"
}

game = {
    speed: 50,
    gameRunning: false,
    numPlayers: 0,
    turnIndex: 0,
    playerWhoWonLastTrick: 1,
    cardsPlayed: 0,
    tricksPlayed: 0,
    cardHistory: {},
    messages: {
        currentTrumpSuit: ""
    },
    players: {
        1: {
            currentHand: [],
            currentCard: "blank",
            teamId: 1,
            state: "EMPTY"
        },
        2: {
            currentHand: [],
            currentCard: "blank",
            teamId: 2,
            state: "EMPTY"
        },
        3: {
            currentHand: [],
            currentCard: "blank",
            teamId: 1,
            state: "EMPTY"
        },
        4: {
            currentHand: [],
            currentCard: "blank",
            teamId: 2,
            state: "EMPTY"
        }
    },
    teams: {
        1: {
            tricks: 0,
            score: 0,
            otherTeamId: 2
        },
        2: {
            tricks: 0,
            score: 0,
            otherTeamId: 1
        }
    }
}

let resetMultiPlayerGame = () => {
    game.numPlayers = 0
    game.gameFinished = false
    game.loading = false
    game.gameRunning = true
    game.turnIndex = 0
    game.playerWhoWonLastTrick = 1
    game.cardsPlayed = 0
    game.tricksPlayed = 0
    game.cardHistory = {}
    game.players = {
        1: {
            currentHand: [],
            currentCard: "blank",
            teamId: 1,
            state: "EMPTY"
        },
        2: {
            currentHand: [],
            currentCard: "blank",
            teamId: 2,
            state: "EMPTY"
        },
        3: {
            currentHand: [],
            currentCard: "blank",
            teamId: 1,
            state: "EMPTY"
        },
        4: {
            currentHand: [],
            currentCard: "blank",
            teamId: 2,
            state: "EMPTY"
        }
    }
    game.teams = {
        1: {
            tricks: 0,
            score: 0,
            otherTeamId: 2
        },
        2: {
            tricks: 0,
            score: 0,
            otherTeamId: 1
        }
    }
}

let resetGame = () => {
    game.numPlayers = 0
    game.gameFinished = false
    game.loading = false
    game.gameRunning = true
    game.turnIndex = 0
    game.playerWhoWonLastTrick = 1
    game.cardsPlayed = 0
    game.tricksPlayed = 0
    game.cardHistory = {}
    game.players = {
        1: {
            currentHand: [],
            currentCard: "blank",
            teamId: 1,
            state: "WAITING"
        },
        2: {
            currentHand: [],
            currentCard: "blank",
            teamId: 2,
            state: "WAITING"
        },
        3: {
            currentHand: [],
            currentCard: "blank",
            teamId: 1,
            state: "WAITING"
        },
        4: {
            currentHand: [],
            currentCard: "blank",
            teamId: 2,
            state: "WAITING"
        }
    }
    game.teams = {
        1: {
            tricks: 0,
            score: 0,
            otherTeamId: 2
        },
        2: {
            tricks: 0,
            score: 0,
            otherTeamId: 1
        }
    }
}

const gameSpeeds = {
    10: 6000,
    20: 5000,
    30: 4000,
    40: 3500,
    50: 3000,
    60: 2000,
    70: 1000,
    80: 500,
    90: 300,
    100: 200
}

let resetTable = () => {
    game.cardHistory = {}
    game.cardsPlayed = 0
    game.turnIndex = 0
    if(Object.keys(game.messages).length > 1) {
        delete game.messages["currentLeadSuit"]
    }
    switch(game.playerWhoWonLastTrick) {
        case 2:
            game.currentPlayerOrder = [2, 3, 4, 1]
            break
        case 3:
            game.currentPlayerOrder = [3, 4, 1, 2]
            break
        case 4:
            game.currentPlayerOrder = [4, 1, 2, 3]
            break
        default:
            game.currentPlayerOrder = [1, 2, 3, 4]
    }
    for(let i = 1; i <= 4; i++) {
        game.players[i].currentCard = "blank"
        game.players[i].state = "WAITING"
    }
}

io.on('connection', (client) => {
    client.on('enter game', (gameType) => {
        game.type = gameType
        if (game.type === "singleplayer") {
            if(game.numPlayers >= 1) {
                game.numPlayers = 0
            }
            game.numPlayers += 1
            startGame()
            client.emit("init", [1, game])
        } else if(game.type === "multiplayer") {
            if(game.players === 4) {
                return
            }
            console.log("enter game")
            game.numPlayers += 1
            const newPlayerId = game.numPlayers
            console.log("number of players:", game.numPlayers, newPlayerId)
            game.players[newPlayerId].state = "WAITING"
            updatePlayers()
            client.emit("init", [newPlayerId, game])
            //console.log(game)
            if (game.numPlayers === 4) {
                console.log("start game")
                startGame()
                updatePlayers()
            }
        }
    })
    client.on('disconnect', () => {
        resetGame()
        if(game.type === "multiplayer") {
            resetMultiPlayerGame()
            updatePlayers()
        }
        console.log("disconnect", game.type)
    })
    let startGame = () => {
        console.log("start game")
        resetGame()
        if(game.type === "multiplayer") {
            resetMultiPlayerGame()
        }
        shuffle(deck)
        dealCards()
        pickTrump()
        io.emit("start game", game)
        nextTrick()
    }
    let nextTrick = () => {
        resetTable()
        updatePlayers()
        playTrick()
    }
    let playTrick = () => {
        let currentPlayerId = game.currentPlayerOrder[game.turnIndex]
        console.log("trick started")
        if(currentPlayerId === 1) {
            game.players[1].state = "PLAY"
            updatePlayers()
        } else {
            game.players[currentPlayerId].state = "PLAY"
            updatePlayers()
            if(game.type === "singleplayer") {
                client.emit("run ai")
            }
        }
    }
    client.on('card played', ([index, card]) => {
        console.log("card played")
        //console.log(game.type)
        let currentPlayerId = game.currentPlayerOrder[game.turnIndex]
        game.cardsPlayed += 1
        game.players[currentPlayerId].currentCard = card
        game.players[currentPlayerId].currentHand.splice(index, 1)
        game.players[currentPlayerId].state = "PLAYED"
        game.cardHistory[currentPlayerId] = card
        if(game.turnIndex === 0) {
            game.leadSuit = suits[card.slice(1, 2)]
            game.messages["currentLeadSuit"] = `lead suit for this trick: ${game.leadSuit}`
        }
        updatePlayers()
        if(game.cardsPlayed === 4) {
            console.log("end of trick")
            if(game.type === "singleplayer") {
                io.emit("end of trick", game)
            } else {
                updatePlayers()
                evaluateTrick()
            }
        } else {
            changeTurn()
            console.log("change turn\n")
            console.log(game.type)
            updatePlayers()
            if(game.type === "singleplayer") {
                console.log("run ai")
                client.emit("run ai")
            }
        }
    })
    client.on('run ai', () => {
        console.log("ai running")
        let currentPlayerId = game.currentPlayerOrder[game.turnIndex]
        AIPlayerPlaysCard(currentPlayerId) // 1. wait for AI to play card
        game.players[currentPlayerId].state = "PLAYED"
        game.cardsPlayed += 1
        console.log(game.cardsPlayed)
        if(game.cardsPlayed === 4) {
            client.emit("end of trick", game)
            return
        }
        changeTurn() // 2. change turn
        currentPlayerId = game.currentPlayerOrder[game.turnIndex]
        updatePlayers()  // 3. display card played
        if(currentPlayerId === 1) {
            return
        }
        client.emit('run ai') // 4. repeat
    })
    client.on('end of trick', () => {
        sleep(gameSpeeds[game.speed])
        evaluateTrick()
    })
    client.on('update speed', (value) => {
        game.speed = value
    })
    let changeTurn = () => {
        game.turnIndex += 1
        let i = game.currentPlayerOrder[game.turnIndex]
        game.players[i].state = "PLAY"
    }
    let AIPlayerPlaysCard = (i) => {
        sleep(gameSpeeds[game.speed])
        const currentHand = game.players[i].currentHand
        const currentHandLength = game.players[i].currentHand.length
        // pick best card:
        const bestIndex = getBestIndex(currentHand)
        game.players[i].currentCard = currentHand[bestIndex]
        // add to card history:
        game.cardHistory[i] = game.players[i].currentCard
        const cardPlayed = game.players[i].currentCard
        if(game.turnIndex === 0) {
            game.leadSuit = suits[cardPlayed.slice(1, 2)]
            game.messages["currentLeadSuit"] = `lead suit for this trick: ${game.leadSuit}`
        }
        // then delete it from the AI's hand
        game.players[i].currentHand.splice(bestIndex, 1)
    }
    getBestIndex = (hand) => {
        // sort cards from best to worst
        const sortedHand = hand.sort(function(a, b) {
            const vA = cardToValue(a)
            const vB = cardToValue(b)
            return vB - vA
        })
        const bestCardIndex = hand.indexOf(sortedHand[0])
        return bestCardIndex
    }
    let sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
    let cardToValue = (card) => {
        const rank = card.substring(0, 1)
        const suit = suits[card.substring(1, 2)]
        let value = cardRanks.indexOf(rank)
        if(suit === game.currentTrump) {
            value += 1000
        } else if(suit === game.leadSuit) {
            value += 100
        }
        return value
    }
    let evaluateTrick = () => {
        updatePlayers()
        console.log("trick evaluated")
        game.tricksPlayed += 1
        let bestValue = 0
        let bestPlayerId = 1
        for (const [k, v] of Object.entries(game.cardHistory)) {
            const currentValue = cardToValue(v)
            if (currentValue > bestValue) {
                bestValue = currentValue
                bestPlayerId = k
            }
        }
        game.playerWhoWonLastTrick = parseInt(bestPlayerId)
        const winningTeamId = game.players[bestPlayerId].teamId
        game.teams[winningTeamId].tricks += 1

        // end of round
        if(game.tricksPlayed === 13) {
            if(game.teams[1].tricks > game.teams[2].tricks) {
                game.teams[1].score += game.teams[1].tricks - 6
            }
            else if(game.teams[2].tricks > game.teams[1].tricks) {
                game.teams[2].score += game.teams[2].tricks - 6
            }
            // is game finished?
            if(game.teams[1].score >= 5 || game.teams[2].score >= 5) {
                if(game.teams[1].score >= 5) {
                    game.winner = 1
                } else if(game.teams[2].score >= 5) {
                    game.winner = 2
                }
                io.emit("game finished", game.winner)
                console.log("game reset")
                resetGame()
                return
            } else {
                nextRound()
            }
        } else {
            console.log("next trick in evaluate function")
            nextTrick()
        }
    }
    let nextRound = () => {
        game.teams[1].tricks = 0
        game.teams[2].tricks = 0
        game.tricksPlayed = 0
        shuffle(deck)
        dealCards()
        pickTrump()
        updatePlayers()
        nextTrick()
    }
    let pickTrump = () => {
        const suits = ["hearts", "clubs", "diamonds", "spades"]
        const randomIndex = Math.floor(Math.random() * 4)
        const trump = suits[randomIndex]
        game.currentTrump = trump
        game.messages["currentTrumpSuit"] = `Trump suit for this round: ${game.currentTrump}`
    }
    let dealCards = () => {
        let i = 0
        for (const key of Object.keys(game.players)) {
            game.players[key].currentHand = deck.slice(i, i + 13)
            i += 13
        }
        updateClient()
    }
    let shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    }
    let updateClient = () => {
        client.emit("update client", game)
    }
    let updatePlayers = () => {
        io.emit("update players", game)
    }
})