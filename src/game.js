let io;
let gameSocket;

const questions = [
  {
    question: 'What is 2 + 2?',
    answer: '4',
    list: ['4', '3', '2', '1'],
  },
  {
    question: 'What is the point of life?',
    answer: 'bruh',
    list: ['bruh', 'idk', 'um', 'to bool'],
  },
];

exports.initGame = function (sio, socket) {
  console.log('init game');
  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', { message: 'You are connected to the game! ' });

  gameSocket.on('hostCreateNewGame', hostCreateNewGame);
  gameSocket.on('hostRoomFull', hostPrepareGame);
  gameSocket.on('hostCountdownFinished', hostStartGame);
  gameSocket.on('hostNextRound', hostNextRound);

  gameSocket.on('playerJoinGame', playerJoinGame);
  gameSocket.on('playerAnswer', playerAnswer);
  gameSocket.on('playerRestart', playerRestart);
};

function hostCreateNewGame() {
  console.log('new game');
  const thisGameId = Math.round(Math.random() * 100000);
  this.emit('newGameCreated', { gameId: thisGameId, mySocketId: this.id });
  this.join(thisGameId.toString());
}

function hostPrepareGame(gameId) {
  console.log('prepare');
  const sock = this;
  const data = {
    mySocketId: sock.id,
    gameId,
  };
  io.sockets.in(gameId).emit('beginNewGame', data);
}

function hostStartGame(gameId) {
  console.log('game has started');
  sendQuestion(0, gameId);
}
function hostNextRound(data) {
  if (data.id >= questions.length) {
    io.sockets.in(data.gameId).emit('gameOver', data);
  }
  sendQuestion(data.round, data.gameId);
}

function playerJoinGame(data) {
  console.log(data);
  const sock = this;
  const room = io.sockets.adapter.rooms.get(data.gameId);
  console.log(io.sockets.adapter.rooms);
  console.log(io.sockets.adapter.rooms.get(data.gameId));

  if (room !== undefined) {
    data.mySocketId = sock.id;
    sock.join(data.gameId);
    io.sockets.in(data.gameId).emit('playerJoinGame', data);
  } else {
    this.emit('error', { message: 'This game does not exist. ' });
  }
}

function playerAnswer(data) {
  io.sockets.in(data.gameId).emit('hostCheckAnswer', data);
}

function playerRestart(data) {
  data.playerId = this.id;
  io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
}

function sendQuestion(index, gameId) {
  const data = getData(index);
  io.sockets.in(gameId).emit('newQuestion', data);
}

function getData(index) {
  const question = shuffle(questions[index].question);
  const list = shuffle(questions[index].list);
  const { answer } = questions[index];

  const wordData = {
    round: index,
    question,
    answer,
    list,
  };

  return wordData;
}

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
