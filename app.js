require('dotenv').config();
const express = require('express')
const app = express()
const path = require("path");
const hbs = require("hbs");
const templets_path = path.join(__dirname,"./Templets/views");
const partials_path = path.join(__dirname, "./Templets/partials");
const port = process.env.PORT || 2000;
app.set('view engine', '.hbs');
app.set("views", templets_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
  res.render("index");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})