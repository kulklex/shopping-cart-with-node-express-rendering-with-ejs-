const express = require ('express');
const app = express();

app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())

app.get('/about', {name: 'hassan'})