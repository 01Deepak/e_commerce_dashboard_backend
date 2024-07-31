const express = require('express');
require('./db/config');
const cors = require('cors');
const User = require('./db/User');

const app = express();
app.use(express.json());
app.use(cors());


 app.post('/register', (req, res) => {
    const user = new User(req.body);
    user.save();
    res.send(user);
})

app.listen(4000);