const express = require('express');
require('./db/config');
const User = require('./db/User');

const app = express();
app.use(express.json());

 app.post('/register', (req, res) => {
    const user = new User(req.body);
    user.save();
    res.send(user);
})

app.listen(4000);