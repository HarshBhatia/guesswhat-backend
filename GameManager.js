const shortid = require("shortid");
const games = {};

//rounds start from 1

const getRandomWord = () =>
  ["hello", "world", "bye", "whatup"][Math.floor(Math.random() * 3)];

function GameManager(onUpdate) {
  /**
   * @param  {String} host - socket id of the host player
   * @param  {Object} options - {roundTime, numberOfRounds}
   */
  const createGame = (host, options) => {
    const { roundTime, numberOfRounds } = options;
    const { name, id } = host;
    const gameId = shortid.generate();

    games[gameId] = {
      timeRemaining: roundTime,
      roundTime,
      currentRound: 0,
      numberOfRounds,
      currentWord: null,
      canvas: null,
      turn: id,
      host: id,
      players: {
        [id]: {
          points: 0,
          name: name,
          hasGuessed: false,
        },
      },
    };

    return gameId;
  };

  /**
   * @param  {String} gameId - ID of the game to join
   * @param  {Object} player - {name, id} Name and Socket ID of player
   */
  const joinGame = (gameId, player) => {
    const { name, id } = player;

    if (!games[gameId]) return;
    games[gameId].players[id] = { points: 0, name, hasGuessed: false };

    return onUpdate(games);
  };

  /**
   * @param  {String} gameId - ID of the game to leave
   * @param  {String} playerId - Socket ID of player
   */
  const leaveGame = (gameId, playerId) => {
    if (!games[gameId]) return;
    delete games[gameId].players[playerId];

    return onUpdate(games);
  };

  /**
   * @param  {String} gameId - ID of game to start next round
   */
  const startNextRound = (gameId) => {
    if (!games[gameId]) return;

    // reset timer
    games[gameId].timeRemaining = games[gameId].roundTime;

    // increment round number
    games[gameId].currentRound += 1;

    // get new word
    games[gameId].currentWord = getRandomWord();

    // erase canvas
    games[gameId].canvas = null;

    // cycle turn
    // games[gameId].turn = hostId;

    startRoundTimer(gameId);

    return onUpdate(games);
  };

  const startRoundTimer = (gameId) => {
    const timer = setInterval(
      function (gameId) {
        games[gameId].timeRemaining -= 1;
        onUpdate(games);
        if (games[gameId].timeRemaining < 1) {
          clearInterval(timer);
        }
      },
      1000,
      gameId
    );
  };

  return { createGame, joinGame, leaveGame, startNextRound };
}

module.exports = GameManager;
