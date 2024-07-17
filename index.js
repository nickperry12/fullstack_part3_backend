const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(express.json());
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));
app.use(cors());

let contacts = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// Pretty-print JSON responses
app.set('json spaces', 2);

// generate a unique id
const generateId = () => {
  return String(Math.floor(Math.random() * 2000));
}

// retrieve home page
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// retrieve full list of contacts
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

// retrieve info page
app.get('/info', (req, res) => {
  const currentDateTime = (new Date()).toString();
  const info = `Phonebook has info for ${contacts.length} people`;
  res.send(
    `<p>${info}</p><p>${currentDateTime}</p>`
  )
});

// retrieve single contact
app.get('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  const contact = contacts.find(contact => contact.id === id);
  
  if (contact) {
    res.json(contact);
  } else {
    res.statusMessage = 'Contact cannot be found';
    res.status(404).end();
  }
});

// remove a contact from contacts
app.delete('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter(contact => contact.id !== id);
  res.status(204).end();
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
  } else if (contacts.find(contact => contact.name === body.name)) {
    return res.status(404).json({
      error: "Contact with that name already exists"
    });
  }

  let id = generateId();
  let contact = {
    id: id,
    name: req.body.name,
    number: req.body.number
  };

  contacts = contacts.concat(contact);
  res.json(contact);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);