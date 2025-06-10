const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Importamos la configuración de la base de datos
const Role = require('./Role');  // Importa el modelo Role
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Role, 
      key: 'id',
    },
  },
});

// Relación entre Usuario y Role
User.belongsTo(Role, { foreignKey: 'role_id' });  // Un usuario tiene un rol
Role.hasMany(User, { foreignKey: 'role_id' });  // Un rol puede tener muchos usuarios
// Sincronizar la base de datos
sequelize.sync({ alter: true })  // Este método actualiza las tablas sin eliminarlas
  .then(() => console.log('Base de datos sincronizada y alterada correctamente'))
  .catch((err) => console.error('Error al sincronizar la base de datos:', err));

module.exports = User;

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('🧪 Login recibido:', { email, password });

  try {
    const token = await loginUserService(email, password);
    res.json({ token });
  } catch (err) {
    console.error('❌ Error en loginUser:', err.message);
    res.status(500).json({ msg: 'Error en el login', error: err.message });
  }
};

