const Role = require('../models/Role'); // Importar el modelo de Role

// Función para obtener todos los roles
const getRolesService = async () => {
  return await Role.findAll();
};

// Función para crear un nuevo rol
const createRoleService = async (role_name) => {
  return await Role.create({ role_name });
};

// Función para actualizar un rol
const updateRoleService = async (id, role_name) => {
  const role = await Role.findByPk(id);
  if (role) {
    role.role_name = role_name;
    await role.save();
    return role;
  } else {
    throw new Error('Role not found');
  }
};

// Función para eliminar un rol
const deleteRoleService = async (id) => {
  const role = await Role.findByPk(id);
  if (role) {
    await role.destroy();
    return true;
  } else {
    throw new Error('Role not found');
  }
};

module.exports = { getRolesService, createRoleService, updateRoleService, deleteRoleService };