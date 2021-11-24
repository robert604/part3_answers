// 3.5
const { request, response } = require("express")
const express = require("express")

const app = express()

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
  console.log("in get all")
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
        //res.json(persons[forDeletion.i])
        persons.splice(forDeletion.i,1)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.use(express.json())

app.post('/api/persons',(req,res)=>{
  const newId = Math.floor(Math.random()*1000000)
  const toAdd = {...req.body, id: newId}
  console.log("in post",toAdd)
  persons.push(toAdd)
  res.json(toAdd)
})

const PORT = 3001

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})