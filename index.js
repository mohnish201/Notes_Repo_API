const express = require("express");
const { connection } = require("./db");
const { NotesRouter } = require("./routes/noteRoutes");
const { UserRouter } = require("./routes/userRoutes");
const cors = require("cors")
const app = express();
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json());
app.use("/users", UserRouter);
app.use("/notes", NotesRouter);

app.get("/", (req, res)=>{
    res.send("Hello world")
})


app.listen(port, async()=>{
    try {
        await connection;
        console.log("Connected to DB");
        console.log("Server is Running at Port 4000")
    } catch (error) {
        console.log(error)
    }
})
