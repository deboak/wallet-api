const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { calculateNewBalance, createTransactionLog } = require('../helpers/transactionHelper');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


const getWallet = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    const transactionDoc = await Transaction.findOne({ user: userId });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(StatusCodes.OK).json({
      msg: 'Wallet retrieved successfully',
      userId: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      transaction: transactionDoc ? transactionDoc.transactions : [],
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to retrieve wallet",
      err: error.message
    })
  }

}

const fundWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }

    const user = await User.findById(id);
    if (!user) {
        throw new BadRequestError('User not found');
    } 
    
    // Update balance
    user.balance = calculateNewBalance(user.balance, amount, 'fund');
    await user.save();

    // Log transaction
    const txn = await Transaction.findOneAndUpdate(
      { user: user._id},
      { $push: {
        transactions: {
         type: "fund",
         amount,
         date: new Date()
        }
       }
      },
      { upsert: true, new: true }
    )
    latestTxn = txn.transactions[txn.transactions.length - 1];

    res.status(StatusCodes.OK).json({
      msg: 'Wallet funded successfully',
      name: user.name,
      balance: user.balance,
      transaction: latestTxn,
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Something went wrong');
  }
};


const withdrawFunds = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }

    const user = await User.findById(id);
    
    if (!user) {
      throw new BadRequestError('User not found');
    } 

    if (user.balance < amount) {
      throw new BadRequestError('Insufficient balance');
    }

    user.balance = calculateNewBalance(user.balance, amount, 'withdraw');
    await user.save();

    const txn = await Transaction.findOneAndUpdate(
      { user: user._id},
      { $push: {
        transactions: {
         type: "withdraw",
         amount,
         date: new Date()
        }
       }
      },
      { upsert: true, new: true }
    )
    latestTxn = txn.transactions[txn.transactions.length - 1];

    res.status(StatusCodes.OK).json({
      msg: 'Withdrawal successful',
      name: user.name,
      balance: user.balance,
      receipt: latestTxn,
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Something went wrong');
  }
};

const transferFunds = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const { recipientEmail, amount } = req.body;

    if (!recipientEmail || !amount || amount <= 0) {
     throw new BadRequestError('Recipient email and valid amount required');
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      throw new NotFoundError('Sender not found');
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
        throw new NotFoundError('Recipient not found');
    }

    if (sender.balance < amount) {
      throw new BadRequestError('Insufficient balance');
    }

    // Deduct from sender
    sender.balance = calculateNewBalance(sender.balance, amount, 'transfer');


    const senderTxn = await Transaction.findOneAndUpdate(
      { user: sender._id},
      { $push: {
        transactions: {
         type: "transfer",
         amount,
         to: recipient.email,
         date: new Date()
        }
       }
      },
      { upsert: true, new: true }
    )
    const senderLatestTxn = senderTxn.transactions[senderTxn.transactions.length - 1];
    
    // Credit recipient
    recipient.balance = calculateNewBalance(recipient.balance, amount, 'fund');
    const recipientTxn = await Transaction.findOneAndUpdate(
      { user: recipient._id },
      { $push: {
        transactions: {
          type: "fund",
          amount,
          from: sender.email,
          date: new Date()
        }
      }},
      { upsert: true, new: true }
    )
    const recipientLatestTxn = recipientTxn.transactions[recipientTxn.transactions.length - 1];

    await sender.save();
    await recipient.save();

    res.status(StatusCodes.OK).json({
      msg: 'Transfer successful',
      senderBalance: sender.balance,
      receipt: {
        sender: senderLatestTxn,
        recipient: recipientLatestTxn
      }
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Transfer failed' });
  }
};


const deleteWallet = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findOneAndDelete(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.status(StatusCodes.OK).json({
      msg: "Wallet deleted successfully",
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to delete wallet",
      err: error.message
    });
  }

}

module.exports = {
    getWallet,
    fundWallet,
    transferFunds,
    withdrawFunds,
    deleteWallet
};