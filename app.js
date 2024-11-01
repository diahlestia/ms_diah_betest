import express  from "express"
import dotenv  from "dotenv"
import routes from "./routes/index.js"
import connectDB from "./config/db.js"
const PORT = process.env.PORT || 3000
dotenv.config();
const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// health checks
app.get('/', (req, res) => {
    res.json({
        message: "Hello"
    })
})

// router middleware
app.use("/api/v1", routes);

app.listen(PORT,()=>{
    connectDB();
    console.log(`listening at port http://localhost:${PORT}`)
})