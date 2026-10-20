import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.conf.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

const UNSPLASH = "https://images.unsplash.com/photo-";
const SIZE = "?w=600&q=80";

const photo = (id) => UNSPLASH + id + SIZE;

const categories = [
  {
    name: "Cafe caliente",
    description: "Espressos, lattes y bebidas calientes",
    imageURL: photo("1572442388796-11668a67e53d"),
  },
  {
    name: "Cafe frio",
    description: "Cold brew y bebidas con hielo",
    imageURL: photo("1461023058943-07fcbe16d735"),
  },
  {
    name: "Postres",
    description: "Pasteles, cupcakes, galletas y chocolates",
    imageURL: photo("1578985545062-69928b1d9587"),
  },
  {
    name: "Snacks",
    description: "Desayunos y alimentos salados",
    imageURL: photo("1568901346375-23c9450c58cd"),
  },
];

const products = [
  {
    name: "Flat white",
    description: "Espresso doble con leche texturizada",
    price: 45,
    category: "Cafe caliente",
    imageURL: photo("1541167760496-1628856ab772"),
  },
  {
    name: "Americano",
    description: "Espresso con agua caliente",
    price: 35,
    category: "Cafe caliente",
    imageURL: photo("1514432324607-a09d9b4aefdd"),
  },
  {
    name: "Capuchino",
    description: "Espresso con leche vaporizada y espuma",
    price: 45,
    category: "Cafe caliente",
    imageURL: photo("1572442388796-11668a67e53d"),
  },
  {
    name: "Latte",
    description: "Espresso con abundante leche",
    price: 48,
    category: "Cafe caliente",
    imageURL: photo("1534778101976-62847782c213"),
  },
  {
    name: "Cortado",
    description: "Espresso con un toque de leche",
    price: 38,
    category: "Cafe caliente",
    imageURL: photo("1509042239860-f550ce710b93"),
  },
  {
    name: "Cafe para dos",
    description: "Dos capuchinos para compartir",
    price: 85,
    category: "Cafe caliente",
    imageURL: photo("1495474472287-4d71bcdd2085"),
  },
  {
    name: "Cold brew",
    description: "Cafe de extraccion en frio con hielo",
    price: 50,
    category: "Cafe frio",
    imageURL: photo("1461023058943-07fcbe16d735"),
  },
  {
    name: "Latte helado",
    description: "Latte servido con hielo",
    price: 52,
    category: "Cafe frio",
    imageURL: photo("1517701550927-30cf4ba1dba5"),
  },
  {
    name: "Pastel de chocolate",
    description: "Rebanada de pastel de chocolate",
    price: 60,
    category: "Postres",
    imageURL: photo("1578985545062-69928b1d9587"),
  },
  {
    name: "Brownie con helado",
    description: "Brownie con helado de vainilla y caramelo",
    price: 58,
    category: "Postres",
    imageURL: photo("1551024506-0bccd828d307"),
  },
  {
    name: "Copa de Oreo",
    description: "Postre en copa con galleta Oreo y chocolate",
    price: 55,
    category: "Postres",
    imageURL: photo("1563805042-7684c019e1cb"),
  },
  {
    name: "Crepas con fresas",
    description: "Crepas con fresas y crema batida",
    price: 60,
    category: "Postres",
    imageURL: photo("1587314168485-3236d6710814"),
  },
  {
    name: "Cupcake de vainilla",
    description: "Cupcake con betun y chispas de colores",
    price: 30,
    category: "Postres",
    imageURL: photo("1486427944299-d1955d23e34d"),
  },
  {
    name: "Cupcake de chocolate",
    description: "Cupcake con betun de chocolate",
    price: 32,
    category: "Postres",
    imageURL: photo("1550617931-e17a7b70dce2"),
  },
  {
    name: "Galletas con chispas",
    description: "Paquete de galletas con chispas de chocolate",
    price: 40,
    category: "Postres",
    imageURL: photo("1558961363-fa8fdf82db35"),
  },
  {
    name: "Galleta de chocolate",
    description: "Galleta artesanal con trozos de chocolate",
    price: 22,
    category: "Postres",
    imageURL: photo("1499636136210-6f4ee915583e"),
  },
  {
    name: "Caja de chocolates",
    description: "Surtido de chocolates finos",
    price: 120,
    category: "Postres",
    imageURL: photo("1481391319762-47dff72954d9"),
  },
  {
    name: "Pan frances",
    description: "Pan frances con platano y moras azules",
    price: 65,
    category: "Snacks",
    imageURL: photo("1484723091739-30a097e8f929"),
  },
  {
    name: "Hamburguesa",
    description: "Hamburguesa doble con queso",
    price: 95,
    category: "Snacks",
    imageURL: photo("1568901346375-23c9450c58cd"),
  },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log("Categorias y productos anteriores eliminados");

  const createdCategories = {};
  for (const category of categories) {
    const created = await Category.create(category);
    createdCategories[category.name] = created._id;
  }
  console.log("Categorias creadas:", Object.keys(createdCategories).join(", "));

  for (const product of products) {
    await Product.create({
      name: product.name,
      description: product.description,
      price: product.price,
      imageURL: product.imageURL,
      category: createdCategories[product.category],
    });
  }
  console.log("Productos creados:", products.length);

  await mongoose.disconnect();
  console.log("Listo");
};

seed();
