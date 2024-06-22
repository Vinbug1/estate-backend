const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config();

// Determine the environment (development, production, etc.)
const env = process.env.NODE_ENV || 'development';

// Sequelize configuration
const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
 // database: process.env.DATABASE_NAME,
  username: process.env.POSTGRES_USER,
  //username: process.env.DATABASE_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  //password: process.env.DATABASE_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Disable logging for simplicity (can be overridden in environment)
});

// Initialize an empty object to store models
const db = {};

// Read all model files in the current directory
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js')) // Exclude index.js and non-JavaScript files
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Store each model in the db object by its name
  });

// Execute the associate method if it exists in each model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach the Sequelize instance to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing the Sequelize instance and models
module.exports = db;











// const Sequelize = require('sequelize');
// const path = require('path');
// const fs = require('fs');
// const dotenv = require('dotenv');

// // Load environment variables from .env file
// dotenv.config();

// // Initialize Sequelize with the correct configuration
// const sequelize = new Sequelize(
//   process.env.DATABASE_NAME,
//   process.env.DATABASE_USERNAME,
//   process.env.DATABASE_PASSWORD,
//   {
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DATABASE_DIALECT,
//   }
// );

// // Initialize an empty object to store your models
// const db = {};

// // Read all model files from current directory (assuming they are all Sequelize models)
// fs.readdirSync(__dirname)
//   .filter(file => file !== 'index.js' && file.endsWith('.js'))
//   .forEach(file => {
//     // Import each model file and initialize it with sequelize and Sequelize.DataTypes
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model; // Store each model in the db object by its name
//   });

// // Execute the associate method if it exists in each model
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Attach the Sequelize instance to the db object
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// // Export the db object containing Sequelize instance and models
// module.exports = db;












// const Sequelize = require('sequelize');
// const path = require('path');
// const fs = require('fs');
// const dotenv = require('dotenv');

// // Load environment variables from .env file if present
// dotenv.config();

// // Determine the environment (development, production, etc.)
// const env = process.env.NODE_ENV || 'development';
// const configPath = path.join(__dirname, '..', 'config', 'config.json');
// const config = require(configPath)[env];

// // Initialize Sequelize with the configuration
// const sequelize = new Sequelize(config.database, config.username, config.password, {
//   host: config.host,
//   dialect: 'postgres',
//   logging: config.logging || false, // Optional: Disable logging if not needed
// });

// // Initialize an empty object to store models
// const db = {};

// // Read all model files in the current directory
// fs.readdirSync(__dirname)
//   .filter(file => file !== 'index.js' && file.endsWith('.js')) // Exclude index.js and non-JavaScript files
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model; // Store each model in the db object by its name
//   });

// // Execute the associate method if it exists in each model
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Attach the Sequelize instance to the db object
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// // Export the db object containing the Sequelize instance and models
// module.exports = db;

