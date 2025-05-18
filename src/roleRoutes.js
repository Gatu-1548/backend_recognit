const express = require('express');
const { createRole, updateRole, deleteRole, getRoles } = require('../src/controllers/roleController');
const router = express.Router();

// Ruta para obtener todos los roles
router.get('/get', getRoles);

// Ruta para crear un nuevo rol
router.post('/create', createRole);

// Ruta para actualizar un rol (usando JSON en el cuerpo de la solicitud)
router.put('/update', updateRole);

// Ruta para eliminar un rol (usando JSON en el cuerpo de la solicitud)
router.delete('/delete', deleteRole);


module.exports = router;