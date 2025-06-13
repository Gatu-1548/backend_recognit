require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const userRoutes = require('./src/routes');
const roleRoutes = require('./src/roleRoutes');
const generateUIroutes = require('./src/generateUI');

const app = express();
const port = 5000;

// Crear servidor HTTP
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ["*"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

let rooms = {};        
let widgetData = {};  

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/generate-ui', generateUIroutes);

// WebSockets
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado');

  socket.on('joinRoom', (roomName) => {
    console.log(`➡️ Cliente se unió a la sala: ${roomName}`);
    socket.join(roomName);

    // Inicializar sala si no existe
    if (!rooms[roomName]) {
      rooms[roomName] = 0;
      widgetData[roomName] = {};
    }

    rooms[roomName] += 1;

    // Emitir mensaje y datos actuales
    io.to(roomName).emit('message', `Un nuevo usuario se ha unido a la sala: ${roomName}`);
    socket.emit('joinRoom', `Te has unido correctamente a la sala: ${roomName}`);

    // Enviar los widgets actuales al nuevo usuario
    socket.emit('receiveWidgets', { widgets: widgetData[roomName] });

    // Emitir lista de salas activas
    io.emit('activeRooms', Object.keys(rooms));
  });

  socket.on('shapeChange', ({ roomName, shapes }) => {
    socket.to(roomName).emit('receiveShapes', { shapes });
  });

  socket.on('codeGenerated', ({ roomName, htmlCode, cssCode }) => {
    socket.to(roomName).emit('receiveCode', { htmlCode, cssCode });
  });

  //  NUEVO: sincronización de widgets
  socket.on('widgetsChange', ({ roomName, widgets }) => {
    widgetData[roomName] = widgets;
    socket.to(roomName).emit('receiveWidgets', { widgets }); 
  });

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado');
    for (let roomName in rooms) {
      if (rooms[roomName] > 0) rooms[roomName] -= 1;
    }
    io.emit('activeRooms', Object.keys(rooms));
  });
});

// Iniciar servidor
server.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});