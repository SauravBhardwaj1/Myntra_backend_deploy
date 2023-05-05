const express = require('express');
const { userRoutes } = require('./Routes/userRoutes');
const { productRoutes } = require('./Routes/productRoutes');
const {cartRoutes } = require('./Routes/cartRoutes')
const { connection } = require('./config/db');
const { authenticate } = require('./middleware/auth.middleware');
const cors = require("cors")
const app = express();
require('dotenv').config()

app.use(express.json())

// app.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { adminRoutes } = require('./Routes/adminRoutes');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for BOLT',
      version: '1.0.0',
      description:
        'This is a BOLT API application made with Express. It retrieves data from BOLT-BACKENED.',
      contact: {
        name: 'BOLT',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:7913',
        description: 'Development server',
      },
    ],

    components:{
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'  
        }
      }
    }
  };

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./Routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json())
app.use(cors())

app.use("/users", userRoutes);

app.use(authenticate)


app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes)



app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error.message)       
    }
    console.log(`server runnning on port ${process.env.port} `)
})