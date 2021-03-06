const createRandomTeams = require('./createRandomTeams')
const createCaptainTeams = require('./createCaptainTeams')
const randomNumber = require('../utils/randomNumber')

module.exports = (eventObj, queue) => {
  const { players, votes } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const userIndexInPlayers = players.findIndex(playerObj => playerObj.id === playerId)

  if (players.length === 0 || userIndexInPlayers === -1) {
    channel.send(`You cannot vote because you aren't in the queue <@${playerId}>`)
  } else {
    const vote = eventObj.content
      .toLowerCase()
      .trim()
      .split('!')[1]
      .split('-')[1]

    if (!votes.playersWhoVoted[playerId]) {
      votes[vote]++
      votes.playersWhoVoted[playerId] = true
    } else {
      channel.send(`You cannot vote because you already voted <@${playerId}>`)
    }
  }

  if (votes.c + votes.r === 6) {
    if (votes.r > votes.c) {
      createRandomTeams(eventObj, queue)
    } else if (votes.c > votes.r) {
      createCaptainTeams(eventObj, queue)
    } else {
      const random = randomNumber(1)

      channel.send(`The voting resulted in a tie. I will choose the team structure at random.`)

      if (random === 0) {
        createRandomTeams(eventObj, queue)
      } else if (random === 1) {
        createCaptainTeams(eventObj, queue)
      } else {
        channel.send(`The universe just exploded...`)
      }
    }
  }
}
