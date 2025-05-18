const { getRolesService, createRoleService, updateRoleService, deleteRoleService } = require('../services/roleService');

const getRoles = async (req, res) => {
  try {
    const roles = await getRolesService();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    res.status(500).json({ message: 'Error al obtener los roles' });
  }
};

const createRole = async (req, res) => {
  const { role_name } = req.body;

  try {
    const newRole = await createRoleService(role_name);
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error al crear el rol:', error);
    res.status(500).json({ message: 'Error al crear el rol' });
  }
};

const updateRole = async (req, res) => {
  const { id, role_name } = req.body;

  try {
    const updatedRole = await updateRoleService(id, role_name);
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await deleteRoleService(id);
    if (result) {
      res.status(200).json({ message: 'Rol eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Error al eliminar el rol' });
  }
};

module.exports = { createRole, updateRole, deleteRole, getRoles };