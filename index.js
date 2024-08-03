const express = require('express');
require('./db/config');
const cors = require('cors');
const User = require('./db/User');
const Product = require('./db/Prduct');

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

app.post('/add-product', async (req, res) => {
    const product = new Product(req.body);
    let result = await product.save();
    res.send(result);
    console.log(result);
})

app.get("/products", async (req, res) => {
    const products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "No products found" });
    }
})

app.delete("/delete/product/:id", async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
})

app.get("/product/:id", async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
        res.send(product);
    } else {
        res.send({ result: "No product found" });
    }
})



app.listen(4000);