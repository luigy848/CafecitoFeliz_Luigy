import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";
import { getBenefits } from "../services/discounts.service.js";

const generateCustomerCode = async () => {
  const customers = await Customer.countDocuments();
  return `CF-${String(customers + 1).padStart(4, "0")}`;
};

const getCustomers = async (req, res, next) => {
  try {
    const { withBenefits } = req.query;

    const customers = await Customer.find({ active: true }).sort({
      createdAt: -1,
    });

    if (withBenefits !== "true") {
      return res.status(200).json(customers);
    }

    const withLoyalty = [];

    for (const customer of customers) {
      const benefits = await getBenefits(customer._id);
      withLoyalty.push({ ...customer.toObject(), ...benefits });
    }

    res.status(200).json(withLoyalty);
  } catch (error) {
    next(error);
  }
};

const searchCustomerByPhone = async (req, res, next) => {
  try {
    const { phone } = req.query;

    const customer = await Customer.findOne({ phone, active: true });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const benefits = await getBenefits(customer._id);

    res.status(200).json({ customer, ...benefits });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const getCustomerBenefits = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const benefits = await getBenefits(id);

    res.status(200).json({ customer, ...benefits });
  } catch (error) {
    next(error);
  }
};

const getCustomerSales = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sales = await Sale.find({ customer: id })
      .populate("servedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const { phone, name } = req.body;

    const customerExist = await Customer.findOne({ phone });
    if (customerExist) {
      return res
        .status(409)
        .json({ message: "That phone number is already registered" });
    }

    const newCustomer = await Customer.create({
      phone,
      name,
      code: await generateCustomerCode(),
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "That phone number is already registered" });
    }
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, name } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { phone, name },
      { new: true, runValidators: true },
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "That phone number is already registered" });
    }
    next(error);
  }
};

const deactivateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export {
  generateCustomerCode,
  getCustomers,
  searchCustomerByPhone,
  getCustomerById,
  getCustomerBenefits,
  getCustomerSales,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
};
