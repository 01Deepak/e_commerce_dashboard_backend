const express = require('express');
require('./db/config');
const cors = require('cors');
const User = require('./db/User');

const app = express();
app.use(express.json());
app.use(cors());


 app.post('/register', async (req, res) => {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body).select('-password');
    if (req.body.password && req.body.email) {
        if (user) {
            return res.send(user);
        }
        return res.send("user not found");
    }else{
        return res.send("user not found");
    }
})

app.listen(4000);