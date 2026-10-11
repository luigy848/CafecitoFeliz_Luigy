import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import PaymentMethod from "../models/PaymentMethod.js";
import {
  calculateDiscount,
  roundMoney,
} from "../services/discounts.service.js";

const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const salesThisYear = await Sale.countDocuments({
    receiptNumber: { $regex: `^CF-${year}-` },
  });
  return `CF-${year}-${String(salesThisYear + 1).padStart(6, "0")}`;
};

const buildSaleItems = async (items) => {
  const saleItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return {
        error: {
          status: 404,
          message: `Product ${item.productId} not found`,
        },
      };
    }

    if (!product.available) {
      return {
        error: {
          status: 409,
          message: `${product.name} is not available right now`,
        },
      };
    }

    saleItems.push({
      product: product._id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      subtotal: roundMoney(product.price * item.quantity),
    });
  }

  return { saleItems };
};

const populateSale = async (sale) => {
  await sale.populate("customer", "name phone code");
  await sale.populate("servedBy", "name role");
  await sale.populate("paymentMethod");
  await sale.populate("products.product", "name imageURL");
  return sale;
};

const createSale = async (req, res, next) => {
  try {
    const { customerId, items, paymentType, paymentMethodId } = req.body;

    let customer = null;

    if (customerId) {
      customer = await Customer.findById(customerId);
      if (!customer || !customer.active) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    let paymentMethod = null;
    if (paymentMethodId) {
      paymentMethod = await PaymentMethod.findById(paymentMethodId);

      if (!paymentMethod || !paymentMethod.isActive) {
        return res.status(404).json({ message: "Payment method not found" });
      }

      if (!customer || paymentMethod.customer.toString() !== customerId) {
        return res.status(403).json({
          message: "That payment method belongs to another customer",
        });
      }
    }

    const { saleItems, error } = await buildSaleItems(items);
    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    const subtotal = roundMoney(
      saleItems.reduce((sum, item) => sum + item.subtotal, 0),
    );

    let visits = 0;
    let discount = { reward: null, name: null, percentage: 0, amount: 0 };

    if (customer) {
      const loyalty = await calculateDiscount(customerId, subtotal);
      visits = loyalty.visits;
      discount = loyalty.discount;
    }

    const total = roundMoney(subtotal - discount.amount);

    const newSale = await Sale.create({
      receiptNumber: await generateReceiptNumber(),
      customer: customer ? customer._id : null,
      products: saleItems,
      subtotal,
      discount,
      total,
      visitsAtSale: visits,
      paymentMethod: paymentMethod ? paymentMethod._id : null,
      paymentType: paymentType || "cash",
      paymentStatus: "paid",
      status: "preparing",
      servedBy: req.user.userId,
    });

    await populateSale(newSale);

    res.status(201).json(newSale);
  } catch (error) {
    next(error);
  }
};

const getSales = async (req, res, next) => {
  try {
    const { status, paymentStatus, from, to } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    const sales = await Sale.find(filters)
      .populate("customer", "name phone code")
      .populate("servedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};

const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id)
      .populate("customer", "name phone code")
      .populate("servedBy", "name")
      .populate("paymentMethod")
      .populate("products.product", "name imageURL");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (error) {
    next(error);
  }
};

const updateSaleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updatedSale = await Sale.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("customer", "name phone code");

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    next(error);
  }
};

export {
  createSale,
  getSales,
  getSaleById,
  updateSaleStatus,
  generateReceiptNumber,
};
