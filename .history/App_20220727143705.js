const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
//console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => console.log(`Listenning on port ${port}`));
