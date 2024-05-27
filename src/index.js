const express = require("express");
const dotenv = require("dotenv");

const { PrismaClient } = require("@prisma/client");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Welcome to my first API");
});

// GET
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany(); //select * from product

  res.status(200).send(products);
});

// GET BY ID
app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(productId),
    },
  });

  if (!product) {
    return res.status(404).send("Product Not Found");
  }

  res.status(200).send(product);
});

// POST
app.post("/products", async (req, res) => {
  const newProductData = req.body;
  const product = await prisma.product.create({
    data: {
      name: newProductData.name,
      price: newProductData.price,
      description: newProductData.description,
      image: newProductData.image,
    },
  });

  res.status(201).send({
    data: product,
    message: "Create Product Success",
  });
});

// DELETE
app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  await prisma.product.delete({
    where: {
      id: parseInt(productId),
    },
  });

  res.status(200).send("Product Deleted");
});

// PUT atau update semua
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  if (
    !(
      productData.name &&
      productData.price &&
      productData.description &&
      productData.image
    )
  ) {
    return res.status(400).send("Some Field Are Missing");
  }

  const product = await prisma.product.update({
    where: {
      id: parseInt(productId),
    },
    data: {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      image: productData.image,
    },
  });

  res.status(200).send({
    data: product,
    message: "Edit Product Success",
  });
});

// PATCH atau update salah satu field
app.patch("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;
  const product = await prisma.product.update({
    where: {
      id: parseInt(productId),
    },
    data: {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      image: productData.image,
    },
  });

  res.status(200).send({
    data: product,
    message: "Edit Product Success",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
