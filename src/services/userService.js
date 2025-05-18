const bcrypt = require('bcryptjs');
const User = require('../models/User');  // El modelo de Usuario
const jwt = require('jsonwebtoken');
const  Role  = require('../models/Role');  // Importar el modelo Role
// Servicio para registrar un nuevo usuario
const registerUserService = async (firstName, lastName, email, gender, password) => {
  console.log('Comprobando si el usuario ya existe...');
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    throw new Error('El usuario ya existe');
  }

  // Encriptar la contraseña
  console.log('Encriptando la contraseña...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear el nuevo usuario en la base de datos
  console.log('Creando el nuevo usuario...');
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    gender,
    password: hashedPassword,
    role_id: 2
  });

  console.log('Nuevo usuario creado:', newUser);
  return newUser;
};

// Servicio para manejar el login del usuario
const loginUserService = async (email, password) => {
  console.log('Buscando el usuario...');
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar si la contraseña es correcta
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  // Generar el JWT
  const payload = { userId: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email:user.email,
                    roleId:user.role_id
                  };
  const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '2h' });

  console.log('Token generado:', token);
  return token;
};
const getAllUsers = async () => {
  try {
     const users = await User.findAll
     ({
      include: {
        model: Role,
        attributes: ['role_name'],  // Aquí puedes elegir qué campos incluir del rol
      },
    });
    return users;
  } catch (error) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
};
const assignRoleToUser = async (userId, roleId) => {
  console.log('userService__userId:', userId, 'roleId:', roleId);

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new Error('Rol no encontrado');
  }

  user.role_id = roleId;
  await user.save();

  return user; // ✅ Ahora sí devuelve el usuario actualizado
};
// Servicio para actualizar un usuario
const updateUserService = async (userId, userData) => {
  try {
    const user = await User.findByPk(userId);  // Buscar el usuario por su ID

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar los campos del usuario con los datos proporcionados
    user.firstName = userData.firstName || user.firstName;
    user.lastName = userData.lastName || user.lastName;
    user.email = userData.email || user.email;
    user.gender = userData.gender || user.gender;

    // Si se proporciona una nueva contraseña, se encripta
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(userData.password, salt);
    }

    await user.save();  // Guardar los cambios en la base de datos
    return user;
  } catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
};

// Servicio para eliminar un usuario
const deleteUserService = async (userId) => {
  try {
    const user = await User.findByPk(userId);  // Buscar al usuario por ID

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.destroy();  // Eliminar el usuario
    return user;
  } catch (error) {
    throw new Error('Error al eliminar el usuario: ' + error.message);
  }
};





module.exports = { registerUserService, loginUserService ,getAllUsers,assignRoleToUser,updateUserService,deleteUserService};

