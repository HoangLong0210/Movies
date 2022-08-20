const { application } = require("express");
const express = require("express");

require("dotenv").config();
console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listenning on port ${port}`));
