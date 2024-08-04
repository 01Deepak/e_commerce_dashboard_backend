const express = require('express');
require('./db/config');
const cors = require('cors');
const User = require('./db/User');
const Product = require('./db/Prduct');
const dotenv = require('dotenv');
const Jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
console.log("jwtSecretKey = ",jwtSecretKey);


 app.post('/register', async (req, res) => {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    if (result) {
        Jwt.sign({user}, jwtSecretKey, (err, token) => {
            if (err) {
                res.send({result: "Something went wrong"});
            }else{
                res.send({result,token: token});
            }
        })
    }
})

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body).select('-password');
    if (req.body.password && req.body.email) {
        if (user) {
            Jwt.sign({user}, jwtSecretKey, (err, token) => {
                console.log("eeeeeee = ",err);
                
                if (err) {
                    res.send({result: "Something went wrong"});
                }
                res.send({"result":user,token: token});
            })
            // return res.send(user);
        }
        // return res.send("user not found");
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

app.put("/update/product/:id", async (req, res) => {
    const result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );
    res.send(result);
})

app.get("/search/product/:key", async (req, res) => {

    const searchKey = req.params.key;
    const result = await Product.find({
        "$or": [
            { name: { $regex: searchKey, $options: "i"  } },
            { company: { $regex: searchKey, $options: "i"  } },
            { category: { $regex: searchKey, $options: "i"  } },
            { price: { $regex: searchKey, $options: "i"  } }
        ]
    });
    res.send(result);
})



app.listen(4000);