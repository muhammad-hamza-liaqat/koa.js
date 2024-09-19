const koa = require("koa");
const bodyParser = require("koa-bodyparser");
require("dotenv").config();
const app = new koa();

app.use(bodyParser());

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.warn(`server is running on http://localhost:${PORT}/`)
})