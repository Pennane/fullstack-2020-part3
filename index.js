require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonenumber = require('./models/phonenumber')

morgan.token('body', (req, res) => JSON.stringify(req.body))

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.static('build'))

const getAll = (req, res, next) => {
  Phonenumber.find({}).then((persons) => res.json(persons))
}

const getById = (req, res, next) => {
  const { id } = req.params
  Phonenumber.findById(id)
    .then((phonenumber) => {
      if (phonenumber) {
        res.json(phonenumber)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
}

const updateById = (req, res, next) => {
  console.log('updating by id')
  const { name, number } = req.body
  console.log(name)
  const { id } = req.params

  console.log(name, number, id)

  if (!id) {
    return next(new Error('Missing id'))
  }

  if (!name || !number) {
    return next(new Error('Missing name or number'))
  }

  Phonenumber.findByIdAndUpdate(
    id,
    { name: name, number: number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNumber) => res.json(updatedNumber))
    .catch((error) => next(error))
}

const add = (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return next(new Error('Missing name or number'))
  }

  const phonenumber = new Phonenumber({
    name,
    number
  })

  phonenumber
    .save()
    .then((savedNumber) => res.json(savedNumber))
    .catch((error) => next(error))
}

const remove = (req, res, next) => {
  const { id } = req.params
  Phonenumber.findByIdAndRemove(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error))
}

app.get('/api/persons', getAll)

app.get('/api/persons/:id', getById)

app.put('/api/persons/', add)

app.put('/api/persons/:id', updateById)

app.delete('/api/persons/:id', remove)

app.get('/info', async (req, res, next) => {
  let numberCount = await Phonenumber.countDocuments({})

  let view = `
        <h1>Info</h1>
        <p>Phonebook has info for ${numberCount} people</p>
        <p>Received at ${new Date()}</p>
  `

  res.send(view)
})

const errorHandler = (error, req, res, next) => {
  if (error.message === 'Missing name or number') {
    return res.status(400).send({ error: 'missing name or number' })
  }

  if (error.message === 'Missing id') {
    return res.status(400).send({ error: 'missing id' })
  }

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
