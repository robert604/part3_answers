require('dotenv').config()
const express = require("express")
const app = express()
const morgan = require('morgan')
const cors =  require('cors')

app.use(express.static('build'))
app.use(express.json())
const {Person,connect,closeConnection} = require('./models/person')


app.use(morgan(function(tokens,req,res){
  return JSON.stringify(req.body)
}))
app.use(cors())

const errorHandler = (error,req,res,next)=>{
  if(error.name==='CastError') {
    return res.status(400).send({error:'malformed id'})
  } else if(error.name==="ValidationError") {
    return res.status(400).json({error: error.message})
  }
  next(error)
}



app.get('/',(req,res,next)=>{
    res.send('<h1>Hello There!</h1>')
})


app.get('/info',(req,res,next)=>{
  connect().then(response=>{
    Person.find({}).then(persons=>{
      const str = `<p>Phonebook has info for ${persons.length} people</p>` + '<p>' + new Date().toString() +'</p>'
      res.send(str)
      closeConnection()
    }).catch(error=>{
      next(error)
    })
  })
})

app.get('/api/persons',(req,res,next)=>{
  const query = req.query
  connect().then(result=>{
    Person.find(query).then(persons=>{
      res.json(persons)      
      closeConnection()       
    }).catch(error=>{
      next(error)
    })
  })  
})

app.get('/api/persons/:id',(req,res,next)=>{
  const id = req.params.id
  connect().then(result=>{
    Person.findById(id).then(person=>{ 
      if(person) {
        res.json(person)
      } else {
          res.status(404).end()
      }
      closeConnection()
    }).catch(error=>{
      next(error)
    })
  }) 
})

app.put('/api/persons/:id',(req,res,next)=>{
  const id = req.params.id
  const update = req.body
  connect().then(result=>{
    Person.findByIdAndUpdate(id,update,{new:true}).then(person=>{
      if(person){
        res.json(person)
      } else {
        res.status(404).end()
      }
      closeConnection()
    }).catch(error=>{
      next(error)
    })
  })
})

app.delete('/api/persons/:id',(req,res,next)=>{
  const id = req.params.id
  connect().then(result=>{
    Person.findByIdAndDelete(id).then(result=>{ 
      if(result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
      closeConnection()
    }).catch(error=>{
      next(error)
    })
  }) 
})

app.post('/api/persons',(req,res,next)=>{
  const newInfo = req.body
  connect().then(result=>{
    const person = new Person({
      name: newInfo.name,
      number: newInfo.number
    })    
    person.save().then(result=>{
      res.json(result)
      closeConnection()
    }).catch(error=>{
      next(error)
    })
  })
})



app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})