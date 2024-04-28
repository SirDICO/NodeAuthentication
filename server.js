import express from 'express';
import dotenv from 'dotenv'
import 'express-async-error'


import connectDB  from './db/connect.js'
import authRoute from './routes/authRoute.js'

import notFoundMiddleware from './middlewares/not-found.js';
import errorHandlerMiddleware from './middlewares/error-handler.js';

dotenv.config()  
const app = express();
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Welcome')
})
app.use('/api/v1/auth', authRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



const port = process.env.PORT || 8000   // get port from env if exist

// start server after connecting to Db
const startServer = async ()=> {

        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=> {
            console.log(`MongoDB Connected this path: ${process.env.MONGO_URL}`)
            console.log(`Server runing on port : ${port}`)
    })
  
}

startServer();