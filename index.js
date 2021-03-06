// Dependencies
require('dotenv').config({ path: `${__dirname}/.env` })
const Discord = require('discord.js')

// Actions
const { enterQueue, leaveQueue, getQueueStatus, getVoteStatus, submitVote, sendCommandList } = require('./actions')

// Queue Managment
const { determinePlayerQueue } = require('./utils/managePlayerQueues')

// Discord Bot
const bot = new Discord.Client()

// Environment Variables
const { token, NODE_ENV } = process.env

bot.on('ready', e => {
  const { username, id } = bot.user
  console.log(`Logged in as: ${username} - ${id}`)
})

bot.on('message', eventObj => {
  const msg = eventObj.content.trim().toLowerCase()
  const type = eventObj.channel.type
  const isCommand = msg.startsWith('!')

  // If this is not a command, we don't give a f**k about what happens
  // If this is a DM to the bot, we don't give a f**k about what happens
  // See ya l8r virgin
  if (!isCommand) return
  if (NODE_ENV !== 'development' && type === 'dm') return

  const channel = eventObj.author.lastMessage.channel
  const command = msg.split(' ')[0]
  const playerId = eventObj.author.id
  const queue = determinePlayerQueue(playerId, command, channel)
  const validCommands = {
    '!6m-q': true,
    '!6m-leave': true,
    '!6m-status': true,
    '!6m-votestatus': true,
    '!6m-r': true,
    '!6m-c': true,
  }

  if (isCommand && !queue && validCommands[command]) {
    channel.send('There are currently no active queues. Type !6m-q to create the first one!')
    return
  }

  switch (command) {
    case '!6m-q':
      enterQueue(eventObj, queue)
      break
    case '!6m-leave':
      leaveQueue(eventObj, queue)
      break
    case '!6m-status':
      getQueueStatus(eventObj, queue)
      break
    case '!6m-votestatus':
      getVoteStatus(eventObj, queue)
      break
    case '!6m-r':
    case '!6m-c':
      submitVote(eventObj, queue)
      break
    case '!6m-help':
      sendCommandList(eventObj)
    default:
      return
  }

  // console.log('Found queue:', queue)
})

bot.on('disconnect', e => {
  console.log('Bot disconnected:', e)
})

bot.login(token)

module.exports = bot
