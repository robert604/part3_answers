// 3.10
const express = require("express")
const morgan = require('morgan')
const cors =  require('cors')

const app = express()
app.use(morgan(function(tokens,req,res){
  return JSON.stringify(req.body)
}))
app.use(cors())
app.use(express.static('build'))

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/',(req,res)=>{
    res.send('<h1>Hello There!</h1>')
})

app.get('/info',(req,res)=>{
  const str = `<p>Phonebook has info for ${persons.length} people</p>` + '<p>' + new Date().toString() +'</p>'
  res.send(str)
})

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
  const id = Number(req.params.id)
  const person = persons.find(person=>person.id===id)
  if(person) {
      res.json(person)
  } else {
      res.status(404).end()
  }
})

app.delete('/api/persons/:id',(req,res)=>{
    const idToDelete = Number(req.params.id)
    const idsAndIndexes = persons.map((person,i)=>{return {id:person.id,i:i}})
    const forDeletion = idsAndIndexes.find(({id})=>idToDelete===id)
    if(forDeletion) {
        persons.splice(forDeletion.i,1)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.use(express.json())

app.post('/api/persons',(req,res)=>{
  const newItem = req.body
  if(!("name" in newItem) || !("number" in newItem)) {
    res.status(400).json({error: "Both name and number must be provided"})
    return
  }
  const existing = persons.find(person=>person.name===newItem.name)
  if(existing) {
    res.status(400).json({error: "Name must be unique"})
    return
  }

  const newId = Math.floor(Math.random()*1000000)
  const toAdd = {...newItem, id: newId}
  persons.push(toAdd)
  res.json(toAdd)
})

const PORT = process.env.PORT || 3001

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})