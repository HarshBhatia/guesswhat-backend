const io = require("socket.io")();
const shortid = require("shortid");
const GameManager = require("./GameManager");
const games = {};

io.on("connection", (client) => {
  client.on("createGame", (name, options) => {
    const gameId = shortid.generate();
    const gm = new GameManager({ id: client.id, name }, options, (state) => {
      console.log(state);
      io.emit(gameId, state);
    });
    client.emit("gameCreated", gameId);
    games[gameId] = gm;
  });

  client.on("joinGame", (gameId, name) => {
    games[gameId].joinGame({ name, id: client.id });
  });

  client.on("startNextRound", (gameId) => {
    games[gameId].startNextRound();
  });
});

const port = 4001;
io.listen(port);
console.log("listening on port ", port);
