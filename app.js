const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const userRouter = require('./routes/users');
const errorHandler = require('./middleware/error-handler');
const db = require('./index'); // Import Sequelize instance and models

// Initialize express app
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Routes
const api = process.env.API_URL || '/api';
app.use(`${api}/users`, userRouter);

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Slashpoint API documentation',
            version: '1.0.0',
            description: 'This is a simple CRUD API application made with Node.js, Express, and documented with Swagger.',
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Error handling
app.use(errorHandler);

// Ensure database connection is successful before starting the server
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');

        // Sync models
        return db.sequelize.sync();
    })
    .then(() => {
        console.log('Database synced successfully.');

        // Start the server
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit the process with failure
    });

// Export the app for testing
module.exports = app;



// using mongoose you can uncomment the code below: 
// const express = require('express');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// require('dotenv').config();
// const userRouter = require('./routes/users');
// const errorHandler = require('./middleware/error-handler');

// const app = express();

// // Middleware setup
// app.use(cors());
// app.use(express.json());
// app.use(morgan('tiny'));

// // Routes
// const api = process.env.API_URL || '/api';
// app.use(`${api}/users`, userRouter);

// // Swagger setup
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Slashpoint API documentation',
//       version: '1.0.0',
//       description: 'This is a simple CRUD API application made with node.js, Express and documented with Swagger.',
//     },
//     servers: [
//       {
//         url: "http://localhost:3000",
//       },
//     ],
//   },
//   apis: ['./routes/*.js'], // Path to the API docs
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// // Error handling
// app.use(errorHandler);

// // Database Connection
// const connectionURI = process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;

// mongoose.connect(connectionURI, {
//   dbName: 'appAdmin_db',
//   //useNewUrlParser: true,
//   //useUnifiedTopology: true,
// }).then(() => {
//   console.log('Database Connection is ready...');
// }).catch((error) => {
//   console.error('Database Connection Error:', error);
// });

// // Start the server
// const port = process.env.PORT || 3000;
// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// // Export the app
// module.exports = app;





// // const express = require('express');
// // const morgan = require('morgan');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const http = require('http');
// // const swaggerJsdoc = require('swagger-jsdoc');
// // const swaggerUi = require('swagger-ui-express');
// // require('dotenv').config();
// // const userRouter = require('./routes/users');
// // const errorHandler = require('./middleware/error-handler');
// // const app = express();

// // const server = http.createServer(app);

// // // Middleware setup
// // app.use(cors());
// // app.use(express.json());
// // app.use(morgan('tiny'));

// // // Routes
// // const api = process.env.API_URL || '/api';
// // app.use(`${api}/users`, userRouter);

// // // Swagger setup
// // const swaggerOptions = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'Slashpoint API documentation',
// //       version: '1.0.0',
// //       description: 'This is a simple CRUD API application made with node.js, Express and documented with Swagger.',
// //     },
// //     servers: [
// //       {
// //         url: "http://localhost:3000",
// //       },
// //     ],
// //   },
// //   apis: ['./routes/*.js'], // Path to the API docs
// // };

// // const swaggerSpec = swaggerJsdoc(swaggerOptions);
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// // // Error handling
// // app.use(errorHandler);

// // // Database Connection
// // const connectionURI = process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;

// // mongoose.connect(connectionURI, {
// //   dbName: 'appAdmin_db',
// //   //useNewUrlParser: true,
// //   //useUnifiedTopology: true,
// // }).then(() => {
// //   console.log('Database Connection is ready...');
// // }).catch((error) => {
// //   console.error('Database Connection Error:', error);
// // });

// // // Start the server
// // const port = process.env.PORT || 3000;
// // server.listen(port, () => {
// //   console.log(`Server is running on http://localhost:${port}`);
// // });










// // const express = require('express');
// // const morgan = require('morgan');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const http = require('http');
// // const swaggerJsdoc = require('swagger-jsdoc');
// // const swaggerUi = require('swagger-ui-express');
// // //const corsOptions = { origin: ['https://az-gray-express.netlify.app','http://localhost:3000'],credentials: true };
// // require('dotenv').config();
// // const authController = require('./controllers/authController');
// // const userRouter = require('./routes/users')
// // const rbacMiddleware = require('./middleware/rbacMiddleware');

// // const app = express();
// // const server = http.createServer(app);

// // app.use(cors());
// // //app.use(cors(corsOptions));
// // app.use(express.json());
// // app.use(morgan('tiny'));


// // // Routes
// // const api = process.env.API_URL;
// // app.use(`${api}/users`, rbacMiddleware.checkPermission('user'),userRouter);

// // // Swagger setup
// // const swaggerOptions = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'Slashpoint API documentation',
// //       version: '1.0.0',
// //       description: 'This is a simple CRUD API application made with node.js,Express and documented with Swagger.',
// //     },
// //     servers: [
// //       {
// //         url: "http://localhost:3000",
// //       },
// //     ],

// //   },
// //   apis: ['./routes/*.js'],
// // };

// // const swaggerSpec = swaggerJsdoc(swaggerOptions);
// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,{explorer: true}));

// // // Error handling
// // const errorHandler = require('./middleware/error-handler');
// // app.use(errorHandler);

// // // Database Connection
// // const mongoURI = process.env.NODE_ENV === 'production' ? process.env.PROD_MONGO_URI : process.env.DEV_MONGO_URI;

// // mongoose.connect(mongoURI, {
// //   dbName: 'appAdmin-db',
// // }).then(() => {
// //   console.log('Database Connection is ready...');
// // }).catch((error) => {
// //   console.error('Database Connection Error:', error);
// // });

// // // Start the server
// // const port = process.env.PORT || 3000;
// // server.listen(port, () => {
// //   console.log(`Server is running on http://localhost:${port}`);
// // });
