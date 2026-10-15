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
    imageURL: photo("1541167760496-1628856ab772"),
  },
  {
    name: "Cafe frio",
    description: "Frappes, cold brew y bebidas con hielo",
    imageURL: photo("1551024506-0bccd828d307"),
  },
  {
    name: "Postres",
    description: "Pan dulce, pasteles y galletas",
    imageURL: photo("1563805042-7684c019e1cb"),
  },
  {
    name: "Snacks",
    description: "Sandwiches y alimentos salados",
    imageURL: photo("1550617931-e17a7b70dce2"),
  },
];

const products = [
  {
    name: "Espresso",
    description: "Cafe concentrado de 30 ml",
    price: 30,
    category: "Cafe caliente",
    imageURL: photo("1541167760496-1628856ab772"),
  },
  {
    name: "Americano",
    description: "Espresso con agua caliente",
    price: 35,
    category: "Cafe caliente",
    imageURL: photo("1509042239860-f550ce710b93"),
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
    imageURL: photo("1461023058943-07fcbe16d735"),
  },
  {
    name: "Mocha",
    description: "Espresso con chocolate y leche",
    price: 52,
    category: "Cafe caliente",
    imageURL: photo("1514432324607-a09d9b4aefdd"),
  },
  {
    name: "Chocolate caliente",
    description: "Chocolate de mesa con leche",
    price: 42,
    category: "Cafe caliente",
    imageURL: photo("1517701550927-30cf4ba1dba5"),
  },
  {
    name: "Te chai",
    description: "Te negro con especias y leche",
    price: 40,
    category: "Cafe caliente",
    imageURL: photo("1534778101976-62847782c213"),
  },
  {
    name: "Frappe de cafe",
    description: "Cafe frio batido con hielo y crema",
    price: 55,
    category: "Cafe frio",
    imageURL: photo("1551024506-0bccd828d307"),
  },
  {
    name: "Cold brew",
    description: "Cafe de extraccion en frio de 12 horas",
    price: 50,
    category: "Cafe frio",
    imageURL: photo("1558961363-fa8fdf82db35"),
  },
  {
    name: "Latte helado",
    description: "Latte servido con hielo",
    price: 52,
    category: "Cafe frio",
    imageURL: photo("1499636136210-6f4ee915583e"),
  },
  {
    name: "Affogato",
    description: "Espresso sobre helado de vainilla",
    price: 58,
    category: "Cafe frio",
    imageURL: photo("1495474472287-4d71bcdd2085"),
  },
  {
    name: "Concha",
    description: "Pan dulce tradicional",
    price: 25,
    category: "Postres",
    imageURL: photo("1578985545062-69928b1d9587"),
  },
  {
    name: "Pastel de zanahoria",
    description: "Rebanada con glaseado de queso crema",
    price: 60,
    category: "Postres",
    imageURL: photo("1563805042-7684c019e1cb"),
  },
  {
    name: "Galleta de avena",
    description: "Galleta artesanal con pasas",
    price: 22,
    category: "Postres",
    imageURL: photo("1587314168485-3236d6710814"),
  },
  {
    name: "Brownie",
    description: "Brownie de chocolate con nuez",
    price: 35,
    category: "Postres",
    imageURL: photo("1486427944299-d1955d23e34d"),
  },
  {
    name: "Cheesecake",
    description: "Rebanada con mermelada de frutos rojos",
    price: 65,
    category: "Postres",
    imageURL: photo("1484723091739-30a097e8f929"),
  },
  {
    name: "Sandwich de jamon y queso",
    description: "En pan artesanal tostado",
    price: 65,
    category: "Snacks",
    imageURL: photo("1550617931-e17a7b70dce2"),
  },
  {
    name: "Bagel con queso crema",
    description: "Bagel tostado con queso crema",
    price: 55,
    category: "Snacks",
    imageURL: photo("1481391319762-47dff72954d9"),
  },
  {
    name: "Croissant de jamon",
    description: "Croissant relleno de jamon y queso",
    price: 58,
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
