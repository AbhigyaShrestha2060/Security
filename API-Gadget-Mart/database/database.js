const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect('mongodb://127.0.0.1:27017/gadgetMart').then(() => {
    console.log('Database connected!');
  });
};

// Exporting the function
module.exports = connectDatabase;
