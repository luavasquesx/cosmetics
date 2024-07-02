const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware para parsear o body das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const produtosSchema = new mongoose.Schema({
  title: String,
  description: String,
  image_url: String,
  preco: String  // Corrigido para 'preco' conforme a propriedade definida no schema
});

const Produtos = mongoose.model('Produtos', produtosSchema);

// Rota para criar um novo produto
app.post("/", async (req, res) => {
  try {
    const novoProduto = new Produtos({
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url,
      preco: req.body.preco  // Corrigido para 'preco' conforme a propriedade definida no schema
    });

    const produtoSalvo = await novoProduto.save();
    res.status(201).json(produtoSalvo);  // Retorna o produto salvo como JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para listar todos os produtos
app.get('/', async (req, res) => {
  try {
    const produtos = await Produtos.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => { 
  mongoose.connect('mongodb+srv://luanavasquesx:<759216>@cluster0.9nczpxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

  dbName: 'cosmetics'  // Nome do banco de dados
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

  console.log(`App running on port ${port}`);
});
