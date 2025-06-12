const express = require("express");
const cors = require("cors");
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const uploadimage = require("./routes/uploadimage.js");

const { MONGODB_URL, PORT } = require("./config/serverConfig.js");
const { connectdb } = require("./db/connect.js");
const app = express();

app.use(cors()); //  Enable CORS
app.use(express.json()); // Enable JSON body parsing
app.use("/api", authenticationRoutes);
app.use("/api",uploadimage);

async function serverstart() {
 try {
     await connectdb(MONGODB_URL);
     console.log("Connected To Detabase");
     app.listen(3000, () => {
       console.log("server is running on http://localhost:3000");
     });
 } catch (error) {
    throw new error();
    console.log(error)
 }
}
 
serverstart()