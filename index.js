const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Yes Man',
    number: '12341234',
    id: 4
  }
]

const randomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const generateId = () => randomFromRange(1000000000000000, 9999999999999999)

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number)
    return res.status(400).json({
      error: 'Name or number missing'
    })

  let hasPerson = persons.find((person) => person.name === name)

  if (hasPerson)
    return res.status(400).json({
      error: 'Name must be unique'
    })

  const personObject = {
    name,
    number,
    id: generateId()
  }

  persons = persons.concat(personObject)

  res.json(personObject)
})

app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
  let person = persons.find((person) => person.id === Number(req.params.id))

  if (!person) return res.status(404).end()

  res.send(person)
})

app.get('/info', (req, res) => {
  let view = `
        <h1>Info</h1>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>Received at ${new Date()}</p>
    `
  res.send(view)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
