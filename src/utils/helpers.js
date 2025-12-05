const crypto = require('crypto');

exports.generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

exports.calculateTotal = (items, taxRate = 0.18) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

exports.applyDiscount = (total, discountPercent = 0) => {
  const discount = (total * discountPercent) / 100;
  return {
    originalTotal: total,
    discount: Math.round(discount * 100) / 100,
    finalTotal: Math.round((total - discount) * 100) / 100
  };
};

exports.validateShippingAddress = (address) => {
  const required = ['street', 'city', 'state', 'zipCode', 'country'];
  return required.every(field => address && address[field]);
};

exports.paginateResults = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum,
    page: pageNum
  };
};
