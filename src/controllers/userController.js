const { registerUserService, loginUserService ,getAllUsers,assignRoleToUser,updateUserService,deleteUserService} = require('../services/userService');

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { firstName, lastName, email, gender, password } = req.body;
  console.log('Datos recibidos para registro:', { firstName, lastName, email, gender, password });

  try {
    const newUser = await registerUserService(firstName, lastName, email, gender, password);
    console.log('Usuario creado:', newUser);  // Verifica si el usuario fue creado correctamente
    res.status(201).json({ msg: 'Usuario registrado con éxito', user: newUser });
  } catch (err) {
    console.error('Error al registrar el usuario:', err); // Log del error específico
    res.status(500).json({ msg: 'Error en el registro de usuario' });
  }
};


// Controlador para manejar el login del usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await loginUserService(email, password);  // Llamamos al servicio de login
    res.json({ token });  // Devolvemos el token al frontend
  } catch (err) {
    console.error('Error al realizar el login:', err);
    res.status(500).json({ msg: 'Error en el login' });
  }
};
// Controlador para obtener todos los usuarios
const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();  // Llamar al servicio para obtener los usuarios
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};
// Controlador para asignar el rol a un usuario
const assignRole = async (req, res) => {
  console.log('Cuerpo de la solicitud (req.body):', req.body); 
  const { userId, roleId } = req.body;  // Se espera que se pase el userId y roleId en el cuerpo de la solicitud
 // Verifica que el cuerpo tiene los datos que esperas
 if (!userId || !roleId) {
  return res.status(400).json({ message: 'Faltan datos: userId o roleId' });
}
  try {
    // Llamamos al servicio para asignar el rol
   
    const user = await assignRoleToUser(userId, roleId);
    
    res.status(200).json({
      message: 'Rol asignado correctamente',
      user,
    });
  } catch (error) {
    console.error('Error al asignar el rol:', error);
    res.status(500).json({
      message: 'Error al asignar el rol',
      error: error.message,
    });
  }
};


const updateUser = async (req, res) => {
  const { userId, firstName, lastName, email, gender, password } = req.body;

  try {
    // Usa el servicio que ya maneja todo
    const updatedUser = await updateUserService(userId, { firstName, lastName, email, gender, password });

    res.status(200).json({ message: 'Usuario actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const deletedUser = await deleteUserService(userId);

    res.status(200).json({ message: 'Usuario eliminado correctamente', user: deletedUser });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);

    if (error.message.includes('Usuario no encontrado')) {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};
module.exports = { registerUser, loginUser ,listUsers,assignRole,updateUser,deleteUser};