const express = require('express');
const cors = require('cors');
const http = require('http');  // Importamos http para usarlo con socket.io
const socketIo = require('socket.io');  // Importamos socket.io

const userRoutes = require('./src/routes');  // Importamos las rutas de usuario
const roleRoutes = require('./src/roleRoutes');  // Importamos las rutas de roles

const app = express();
const port = 5000;

// Crear servidor HTTP para usarlo con socket.io
const server = http.createServer(app);  // Creamos el servidor HTTP
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ["*"],
    credentials: true
  }
});

// Middleware para permitir peticiones desde otros orígenes
app.use(cors());
app.use(express.json()); // Middleware para procesar solicitudes JSON
let rooms = {};
// Rutas de usuario y roles
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// Configurar socket.io para manejar eventos en tiempo real
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Manejar unirse a una sala específica según la URL
  socket.on('joinRoom', (roomName) => {
    console.log(`Cliente se ha unido a la sala: ${roomName}`);
    
    // Si la sala no existe, inicializarla con 0 usuarios
    if (!rooms[roomName]) {
      rooms[roomName] = 0; // Si no existe la sala, la inicializamos con 0 usuarios
    }
    
    // Incrementar el conteo de usuarios en esa sala
    rooms[roomName] += 1;

    socket.join(roomName);  // El cliente se une a la sala indicada

    // Emitir mensaje a todos los usuarios de la sala cuando un cliente se une
    io.to(roomName).emit('message', `Un nuevo usuario se ha unido a la sala: ${roomName}`);
    io.emit('activeRooms', Object.keys(rooms));
    // Emitir respuesta de vuelta al cliente que se unió
    socket.emit('joinRoom', `Te has unido correctamente a la sala: ${roomName}`);

    // Emitir el listado de salas con la cantidad de usuarios a todos los clientes
   
  });

  // Cuando un usuario manda cambios de shapes
  socket.on('shapeChange', ({ roomName, shapes }) => {
    // Reenviar esos shapes a TODOS los demás usuarios en la sala
    socket.to(roomName).emit('receiveShapes', { shapes });
  });

  // Cuando un usuario genera código HTML y CSS
  socket.on('codeGenerated', ({ roomName, htmlCode, cssCode }) => {
    socket.to(roomName).emit('receiveCode', { htmlCode, cssCode });
  });

  // Manejar desconexión de cliente
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
    
    // Aquí necesitamos recorrer todas las salas y disminuir el conteo de usuarios
    for (let roomName in rooms) {
      if (rooms[roomName] > 0) {
        rooms[roomName] -= 1; // Reducir el conteo de usuarios en la sala
      }
    }

    // Emitir el listado de salas con la cantidad de usuarios a todos los clientes
    io.emit('activeRooms', Object.keys(rooms));
  });
});


// Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});