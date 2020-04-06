const io = require("socket.io")();
const shortid = require("shortid");
const GameManager = require("./GameManager");
const games = {};

const playerGameMap = {};

io.on("connection", (client) => {
  client.on("createGame", (name, options) => {
    const gameId = shortid.generate();
    const gm = new GameManager({ id: client.id, name }, options, (state) => {
      console.log(state);
      io.emit(gameId, state);
    });
    client.emit("gameCreated", gameId);
    playerGameMap[client.id] = gameId;

    games[gameId] = gm;
  });

  client.on("joinGame", (gameId, name) => {
    games[gameId].joinGame({ name, id: client.id });
    playerGameMap[client.id] = gameId;
  });

  client.on("takeGuess", (gameId, guessValue) => {
    games[gameId].takeGuess(client.id, guessValue);
  });

  client.on("startNextRound", (gameId) => {
    games[gameId].startNextRound();
  });

  client.on("disconnect", () => {
    console.log("Player disconnected", client.id);
    games[playerGameMap[client.id]].removePlayer(client.id);
  });
});

const port = 4001;
io.listen(port);
console.log("listening on port ", port);
