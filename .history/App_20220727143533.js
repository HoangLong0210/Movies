const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
//console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => console.log(`Listenning on port ${port}`));
