const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.listen(7500, function() {
    console.log("Server started!");
});