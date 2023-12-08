const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('postData', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

const unknownEndpoint = (request, response) => {
response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

    app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>')
    })
    
    app.get('/api/persons', (req, res) => {
        res.json(persons)
    })

    app.get('/api/info', (req, res) => {
        const date = new Date()
        const numberOfPersons = persons.length
        res.send(`<p>Phonebook has info for ${numberOfPersons} people</p><p>${date}</p>`)
        res.json(info)
    })

    const generateId = () => {
        const minId = 1
        const maxId = 1000000
        let newId

        do {
            newId = Math.floor(Math.random() * (maxId - minId + 1)) + minId
        } while (persons.some(person => person.id === newId))

        return newId
    }
    
    app.post('/api/persons', (request, response) => {
        const body = request.body

        if (!body.name || !body.number) {
            return response.status(400).json({ 
                error: 'name and number are required' 
            })
        }

        const sameName = persons.find(person => person.name === body.name);
        if (sameName) {
            return response.status(400).json({ 
                error: 'name must be unique' 
            })
        }

        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
        }

        persons = persons.concat(person)

        response.json(person)
    })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })