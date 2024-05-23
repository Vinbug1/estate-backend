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
      role: {
          type: DataTypes.STRING,
          defaultValue: 'user',
      },
      pin: {
          type: DataTypes.STRING,
      },
      pinExpiry: {
          type: DataTypes.DATE,
      },
  });

  return User;
};














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