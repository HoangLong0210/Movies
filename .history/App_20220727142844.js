const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();
//console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listenning on port ${port}`));
