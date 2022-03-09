const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')


const app = express();
const server = http.createServer(app)
const io = new Server(server)


const Bikes = require("./model/bikes")

const Contenedor = require(path.join(__dirname, "/model/contenedor.js"));
const products = new Contenedor(path.join(__dirname, "/database/data.json"))

const Chat = require(path.join(__dirname, "/model/chat.js"));
const chats = new Chat(path.join(__dirname, "/database/chat.json"))


try {

  Bikes.loadData()
console.log("se creo la tabla");
//   app.use(express.json())

// //   app.get("/", (rq, rs) => rs.send("Hola"))
  
// //   app.listen(
// //     8080,
// //     () => console.log("Listening")
//   )
} catch (e) {
  console.log(e)
  console.log("could not start servers")
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static(path.join(__dirname, "public")))






// const bikeRouter = require("./routes/bikes")
// app.use("/api/bikes", bikeRouter)
// const homeRouter = require('./routes/home')
// app.use("/", homeRouter)



//---------SOCKET
io.on('connection', async (socket) => {
    console.log((`an user connected ${socket.id}`))


    
    const list = await products.getAll()
    socket.emit("prods", list)

    
    socket.on("newMsj", async data=>{
        const msj = await chats.save(data)
        console.log(msj)
    })


    const msjs = await chats.getAll()
    io.sockets.emit("msjs", msjs)
}) 





//-------- HANDLEBARS

//engine
const { engine } = require('express-handlebars')

app.engine("handlebars", engine({
    layoutsDir: path.join(__dirname, "views/layout"),
    defaultLayout: 'index'
}))
app.set("view engine", "handlebars")
















server.listen(8080, () => console.log(`Server running on http://localhost:8080`))
server.on('err', (err) => console.log(`Error: ${err}`))