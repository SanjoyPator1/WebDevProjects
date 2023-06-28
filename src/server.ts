import express from "express"
import router from "./router"
import morgan from 'morgan'
import cors from 'cors'
// import { protect } from "./modules/auth";

const app = express();

const customLogger = (message) => (req,res,next)=>{
  console.log("custom logger ",message);
  next()
}

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//protect only applies to this and not the others
// app.use('/api',protect,  router)
app.use('/api',  router)

//this are accessible to all i.e. not protected routes
// app.use('/user', createNewUser)
// app.use('/signin', signin)

// to handle async error
app.use((err, req, res,next) => {
  if(err.type === 'auth'){
    res.status(401).json({message: 'unauthorized'})
  }else if(err.type === 'input'){
    res.status(400).json({message: 'invalid input'})
  }else{
    res.status(500).json({message: 'oops, thats on us'})
  }
})

export default app;