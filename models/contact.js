const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB!');
  })
  .catch(error => {
    console.error('There was an error: ', error);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Contact', contactSchema);