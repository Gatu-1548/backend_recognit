const express = require('express');
const router = express.Router();
const { registerUser,loginUser ,listUsers,assignRole,updateUser,deleteUser } = require('./controllers/userController'); // Importar el controlador

// Definir las rutas y los métodos HTTP en este archivo
router.post('/register', registerUser);
// Ruta de login
router.post('/login', loginUser);
router.get('/list', listUsers);

router.put('/assign-role', assignRole); 
// Ruta para actualizar un usuario (enviar los datos en el body)
router.put('/update', updateUser);

// Ruta para eliminar un usuario (enviar el userId en el body)
router.delete('/delete', deleteUser);


module.exports = router;