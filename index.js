const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://mychoe:qwerty123@boilerplate.uhfbm.mongodb.net/boilerplate?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! My first Node JS!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`)
})