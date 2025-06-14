const express = require("express");
const cors = require("cors");
const uploadimage = require("./routes/uploadimage.js");
const authenticationroutes = require("./routes/authenticationroutes.js");
const { MONGODB_URL, PORT } = require("./config/serverConfig.js");
const { connectdb } = require("./db/connect.js");
const { getImageController } = require("./controller/getImageController.js");
const app = express();
const getimageroutes = require("./routes/getimageroutes.js");

app.use(cors()); //  Enable CORS
app.use(express.json()); // Enable JSON body parsing
app.use("/api", authenticationroutes);
app.use("/api", uploadimage);
app.use("/api", getimageroutes);

async function serverstart() {
  try {
    await connectdb(MONGODB_URL);
    console.log("Connected To Detabase");
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database connection failed");
  }
}

serverstart();

// https://github.com/jaypatel345/Crypto_Vault_Frontend/tree/main/client
// https://github.com/jaypatel345/Crypto_Vault_Backend/tree/main/server
