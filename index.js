const express = require("express");
const cors = require("cors");
const cryptoRoutes = require("./routes/crypto.route");

async function main() {
  try {
    const app = express();

    app.use(cors());

    app.use(express.json());

    app.use("/api/crypto", cryptoRoutes);

    app.get("/", (req, res) => res.send("welcome to crypto-dzap API!"));

    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  } catch (err) {
    console.error("something went wrong", err);
    throw err;
  }
}

main();
