// models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    occupation: {
      type: DataTypes.STRING,
    },
    pin: {
      type: DataTypes.STRING,
    },
    pinExpiry: {
      type: DataTypes.DATE,
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
  };

  return User;
};
