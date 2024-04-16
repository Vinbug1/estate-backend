const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
//const corsOptions = { origin: ['https://az-gray-express.netlify.app','http://localhost:3000'],credentials: true };
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
//app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));

// JWT Authentication
const authJwt = require('./helpers/jwt');

// Apply JWT authentication middleware only to routes that require it
const secureRoutes = express.Router();
secureRoutes.use(authJwt());

// Routes
const api = process.env.API_URL;
app.use(`${api}/users`, require('./routes/users'));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Slashpoint API documentation',
      version: '1.0.0',
      description: 'This is a simple CRUD API application made with node.js,Express and documented with Swagger.',
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,{explorer: true}));

// Error handling
const errorHandler = require('./helpers/error-handler.js');
app.use(errorHandler);

// Database Connection
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.PROD_MONGO_URI : process.env.DEV_MONGO_URI;

mongoose.connect(mongoURI, {
  dbName: 'slashpoint-db',
}).then(() => {
  console.log('Database Connection is ready...');
}).catch((error) => {
  console.error('Database Connection Error:', error);
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
