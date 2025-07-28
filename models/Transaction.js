const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['fund', 'withdraw', 'transfer'],
      },
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
      from: {
        type: String,
        default: null,
      },
      to: {
        type: String,
        default: null,
      },
      reference: {
        type: String,
        default: `TXN-${Date.now()}`
      },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);