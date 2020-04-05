const io = require("socket.io")();
const GameManager = require("./GameManager");

const gm = new GameManager(console.log);

const gid = gm.createGame(
  { id: "hostid", name: "host" },
  { roundTime: 10, numberOfRounds: 1 }
);
console.log("Created game.");
gm.joinGame(gid, { name: "harsh", id: "player1" });
console.log("Harsh joins game.");
gm.joinGame(gid, { name: "utkarsh", id: "player2" });
console.log("Utkarsh joins game.");
gm.startNextRound(gid);
console.log("Start Round");

// io.on("connection", (client) => {
// });

// const port = 4001;
// io.listen(port);
// console.log("listening on port ", port);
