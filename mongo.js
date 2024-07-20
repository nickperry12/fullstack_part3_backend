const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide password as an argument.');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://nickperry604:${password}@fullstackcourse.gdpv3p1.mongodb.net/PhonebookData?retryWrites=true&w=majority&appName=FullstackCourse`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
  return;
}

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4]
});

contact.save().then(result => {
  console.log('Contact added!', result);
  mongoose.connection.close();
});