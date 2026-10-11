import PaymentMethod from "../models/PaymentMethod.js";
import Customer from "../models/Customer.js";

const clearOtherDefaults = async (customerId, keepId = null) => {
  const filters = { customer: customerId, isDefault: true };
  if (keepId) filters._id = { $ne: keepId };
  await PaymentMethod.updateMany(filters, { isDefault: false });
};

const getPaymentMethodsByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.query;

    const methods = await PaymentMethod.find({
      customer: customerId,
      isActive: true,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json(methods);
  } catch (error) {
    next(error);
  }
};

const getPaymentMethodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const method = await PaymentMethod.findById(id);

    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    res.status(200).json(method);
  } catch (error) {
    next(error);
  }
};

const createPaymentMethod = async (req, res, next) => {
  try {
    const {
      customerId,
      type,
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv,
      paypalEmail,
      bankName,
      accountNumber,
      isDefault,
    } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isFirstMethod =
      (await PaymentMethod.countDocuments({
        customer: customerId,
        isActive: true,
      })) === 0;

    const newMethod = await PaymentMethod.create({
      customer: customerId,
      type,
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv,
      paypalEmail,
      bankName,
      accountNumber,
      isDefault: isDefault || isFirstMethod,
    });

    if (newMethod.isDefault) {
      await clearOtherDefaults(customerId, newMethod._id);
    }

    res.status(201).json(newMethod);
  } catch (error) {
    next(error);
  }
};

const updatePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cardHolderName, expiryDate, isDefault } = req.body;

    const method = await PaymentMethod.findById(id);

    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    if (cardHolderName !== undefined) method.cardHolderName = cardHolderName;
    if (expiryDate !== undefined) method.expiryDate = expiryDate;
    if (isDefault !== undefined) method.isDefault = isDefault;

    await method.save();

    if (method.isDefault) {
      await clearOtherDefaults(method.customer, method._id);
    }

    res.status(200).json(method);
  } catch (error) {
    next(error);
  }
};

const deletePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const method = await PaymentMethod.findById(id);

    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    method.isActive = false;
    method.isDefault = false;
    await method.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export {
  getPaymentMethodsByCustomer,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
