require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");
const middlewares = require('./middleware')
const controllers = require("./controllers");



app.use(Express.json());
app.use("/user", controllers.userController);
app.use("/log", controllers.logController);

dbConnection.authenticate()
.then(() => {
    let test = dbConnection.sync()
})
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server] listening on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`[Server] crashed`)
    console.log(err)
})

