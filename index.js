const express = require("express");
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb+srv://luanavasquesx:iIrwSkjqDTCYvzdB@cluster0.k98paaw.mongodb.net/vasquescosméticos?retryWrites=true&w=majority&appName=Cluster0', {
});

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    image_url: String,
    value: Number
});

const ProductModel = mongoose.model('Product', ProductSchema);

// Rota GET para obter todos os produtos
app.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products); // Retorna os produtos encontrados como resposta
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar os produtos no banco de dados.");
    }
});

// Rota POST para criar um novo produto
app.post("/", (req, res) => {
    // Extrair os dados do corpo da requisição
    const { title, description, image_url, value } = req.body;

    // Criar um novo produto usando o modelo ProductModel do Mongoose
    const newProduct = new ProductModel({
        title: title,
        description: description,
        image_url: image_url,
        value: value
    });

    // Salvar o novo produto no banco de dados
    newProduct.save()
        .then(product => {
            res.status(201).json(product); // Retornar o produto criado como resposta
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Erro ao salvar o produto no banco de dados.");
        });
});

// Rota PUT para atualizar um produto por ID
app.put("/:id", async (req, res) => {
    const productId = req.params.id;
    const { title, description, image_url, value } = req.body;

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
            title: title,
            description: description,
            image_url: image_url,
            value: value
        }, { new: true });

        if (!updatedProduct) {
            res.status(404).send("Produto não encontrado.");
            return;
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar o produto.");
    }
});

// Rota DELETE para deletar um produto por ID
app.delete("/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).send("Produto não encontrado.");
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao deletar o produto.");
    }
});

app.listen(port, () => {
    console.log('App running on port', port);
});
