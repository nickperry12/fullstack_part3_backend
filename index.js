const express = require('express');
const app = express();
require('dotenv').config();

const morgan = require('morgan');
const Contact = require('./models/contact');

app.use(express.static('dist'));

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));

// Pretty-print JSON responses
app.set('json spaces', 2);
const cors = require('cors');

app.use(cors());
app.use(express.json());

const errorHandler = (error, req, res, next) => { 
  console.error(error);

  if (error.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id '});
  }

  next(error);
}

// retrieve home page
app.get('/', (request, response) => {
  response.send('<h1>Contacts API</h1>');
});

// retrieve full list of contacts
app.get('/api/contacts', (req, res) => {
  Contact.find({})
    .then(contacts => {
      console.log(contacts);
      res.json(contacts);
    })
    .catch(error => {
      console.error('There was an error: ', error);
    });
});

// retrieve info page
app.get('/info', (req, res) => {
  Contact.find({})
    .then(result => {
      const currentDateTime = (new Date()).toString();
      const info = `Phonebook has info for ${result.length} people`;
      res.send(
        `<p>${info}</p><p>${currentDateTime}</p>`
      )
    })
    .catch(error => {
      next(error);
    })
});

// retrieve single contact
app.get('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  
  Contact.findById(id)
    .then(contact => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      next(error);
    })
});

// remove a contact from contacts
app.delete('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
    .then(result => {
      console.log(result);
      res.status(204).end();
    })
    .catch(error => {
      next(error);
    })
});

// create a new contact
app.post('/api/contacts', (req, res) => {
  let body = req.body;
  if (!body.name) {
    return res.status(404).json({
      error: 'Name is missing'
    });
  } else if (!body.number) {
    return res.status(404).json({
      error: 'Number is missing'
    });
  }

  let contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(contact => {
      res.json(contact);
    })
    .catch(error => {
      next(error);
    });
});

app.put('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  let contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact);
    })
    .catch(error => {
      next(error);
    });
});

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on ${PORT}`);