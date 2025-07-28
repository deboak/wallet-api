const calculateNewBalance = (balance, amount, type) => {
  if (type === 'fund') return balance + amount;
  if (type === 'withdraw' || type === 'transfer') return balance - amount;
  return balance;
};

const createTransactionLog = ({ name, userId, type, amount, from = null, to = null }) => {
  return {
    name,
    userId,
    type,
    amount,
    from,
    to,
    date: new Date(),
    reference: `TXN-${Date.now()}`,
  };
};

module.exports = { calculateNewBalance, createTransactionLog };