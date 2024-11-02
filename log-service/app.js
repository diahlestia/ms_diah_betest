import express  from "express"
import dotenv  from "dotenv"
import connectDB from "./config/db.js"
import consumeUserEvents from "./utils/kafka.consumer.js"
const PORT = process.env.PORT || 4000
dotenv.config();
const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// health checks
app.get('/', (req, res) => {
    res.json({
        message: "Hello log-service"
    })
})

consumeUserEvents().catch(console.error);

app.listen(PORT,()=>{
    connectDB();
    console.log(`listening at port http://localhost:${PORT}`)
})