//rounds start from 1

const getRandomWord = () =>
  ["hello", "world", "bye", "whatup"][Math.floor(Math.random() * 3)];

/**
 * @param  {String} host - socket id of the host player
 * @param  {Object} options - {roundTime, numberOfRounds}
 * @param {Function} onUpdate - game state update listener
 */
function GameManager(host, options, onUpdate) {
  const { roundTime, numberOfRounds } = options;
  const { name, id } = host;

  const game = {
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

  /**
   * @param  {String} gameId - ID of the game to join
   * @param  {Object} player - {name, id} Name and Socket ID of player
   */
  const joinGame = (player) => {
    const { name, id } = player;

    if (!game) return;
    game.players[id] = { points: 0, name, hasGuessed: false };

    return onUpdate(game);
  };

  /**
   * @param  {String} gameId - ID of the game to leave
   * @param  {String} playerId - Socket ID of player
   */
  const leaveGame = (playerId) => {
    if (!game) return;
    delete game.players[playerId];

    return onUpdate(game);
  };

  /**
   * @param  {String} gameId - ID of game to start next round
   */
  const startNextRound = () => {
    if (!game) return;

    // reset timer
    game.timeRemaining = game.roundTime;

    // increment round number
    game.currentRound += 1;

    // get new word
    game.currentWord = getRandomWord();

    // erase canvas
    game.canvas = null;

    // cycle turn
    // game.turn = hostId;

    startRoundTimer();

    return onUpdate(game);
  };

  const startRoundTimer = () => {
    const timer = setInterval(function () {
      game.timeRemaining -= 1;
      onUpdate(game);
      if (game.timeRemaining < 1) {
        clearInterval(timer);
      }
    }, 1000);
  };

  return { joinGame, leaveGame, startNextRound };
}

module.exports = GameManager;
