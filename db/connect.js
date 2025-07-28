const mongoose = require('mongoose');
const URI = process.env.MONGO_URI 

const connectDB = async () =>{
  try{
    await mongoose.connect(URI)
    console.log('MongoDB connected successfully')
  }catch(error){
    console.error('MongoDB connection error:', error)
  }
}

module.exports = connectDB;