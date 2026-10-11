import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.conf.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import User from "../models/User.js";
import { getBenefits } from "../services/discounts.service.js";

dotenv.config();

const demoCustomers = [
  { name: "Ana Torres", phone: "5540001001", visits: 3 },
  { name: "Luis Ramirez", phone: "5540001002", visits: 8 },
  { name: "Mariana Lopez", phone: "5540001003", visits: 18 },
  { name: "Jorge Castillo", phone: "5540001004", visits: 32 },
];

const PAYMENT_TYPES = ["cash", "credit_card", "debit_card"];

const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

const roundMoney = (amount) => Math.round(amount * 100) / 100;

const seed = async () => {
  await connectDB();

  const products = await Product.find({ available: true });
  if (products.length === 0) {
    console.log("No hay productos. Corre primero: npm run seed:menu");
    await mongoose.disconnect();
    return;
  }

  const cashier = await User.findOne({ role: "cashier" });
  if (!cashier) {
    console.log("No hay cajero. Corre primero: npm run seed:staff");
    await mongoose.disconnect();
    return;
  }

  const phones = demoCustomers.map((customer) => customer.phone);
  const oldOnes = await Customer.find({ phone: { $in: phones } });
  await Sale.deleteMany({ customer: { $in: oldOnes.map((c) => c._id) } });
  await Customer.deleteMany({ phone: { $in: phones } });
  console.log("Clientes de demostracion anteriores eliminados");

  let counter = (await Customer.countDocuments()) + 1;
  let receipt = 1;

  for (const demo of demoCustomers) {
    const customer = await Customer.create({
      name: demo.name,
      phone: demo.phone,
      code: `CF-${String(counter).padStart(4, "0")}`,
    });
    counter += 1;

    const spacing = Math.max(Math.floor(85 / demo.visits), 1);

    for (let visit = 1; visit <= demo.visits; visit += 1) {
      const date = new Date(Date.now() - visit * spacing * 24 * 60 * 60 * 1000);

      const items = [];
      const howMany = 1 + Math.floor(Math.random() * 3);

      for (let i = 0; i < howMany; i += 1) {
        const product = randomItem(products);
        const quantity = 1 + Math.floor(Math.random() * 2);

        items.push({
          product: product._id,
          name: product.name,
          unitPrice: product.price,
          quantity,
          subtotal: roundMoney(product.price * quantity),
        });
      }

      const subtotal = roundMoney(
        items.reduce((sum, item) => sum + item.subtotal, 0),
      );

      await Sale.create({
        receiptNumber: `CF-DEMO-${String(receipt).padStart(6, "0")}`,
        customer: customer._id,
        products: items,
        subtotal,
        total: subtotal,
        visitsAtSale: demo.visits - visit,
        paymentType: randomItem(PAYMENT_TYPES),
        paymentStatus: "paid",
        status: "delivered",
        servedBy: cashier._id,
        createdAt: date,
        updatedAt: date,
      });

      receipt += 1;
    }

    const benefits = await getBenefits(customer._id);
    const reward = benefits.currentReward;

    console.log(
      `${customer.code}  ${customer.name.padEnd(18)} ${customer.phone}  ` +
        `${String(benefits.visits).padStart(2)} visitas  ->  ` +
        (reward ? `${reward.name} (${reward.percentage}%)` : "sin descuento"),
    );
  }

  await mongoose.disconnect();
  console.log("Listo");
};

seed();
