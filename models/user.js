const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Ensure the field is not empty
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensure the email is valid
      notEmpty: true, // Ensure the field is not empty
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Ensure password is at least 6 characters long
      notEmpty: true, // Ensure the field is not empty
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Ensure the field is not empty
      isNumeric: true, // Ensure the phone contains only numbers
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Ensure the field is not empty
    },
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Ensure the field is not empty
    },
  },
  role: {
    type: DataTypes.ENUM('employee', 'manager', 'admin'),
    allowNull: false,
    validate: {
      isIn: [['employee', 'manager', 'admin']], // Ensure the role is one of the specified values
      notEmpty: true, // Ensure the field is not empty
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.password && user.changed('password')) { // Only hash the password if it was changed
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Instance method to validate password
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;















// using mongoose teh uncomment the model below: 
// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   occupation: { type: String, required: true },
//   role: { type: String, enum: ['employee','manager', 'admin'], required: true },
// });

// // Configure passport-local-mongoose to use email as the username field
// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// const User = mongoose.model('User', userSchema);

// module.exports = User;