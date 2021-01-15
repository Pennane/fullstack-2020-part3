const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.static('build'))

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

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!id)
    return res.status(400).json({
      error: 'id missing'
    })

  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
