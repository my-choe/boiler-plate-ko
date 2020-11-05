const express = require('express')
const app = express()
const port = 5000

// bodyParser가 있기 때문에 request에서 넘어오는 것을 req.body로 받을 수 있음
const bodyParser = require('body-parser');

// 몽고디비 계정 보호를 위해 따로 키 관리함(개발/운영)
const config = require('./config/key');

const { User } = require("./models/User");

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended:true}));

//application/json 타입으로 된 것을 분석해서 가져올 수 있게 함
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('config.mongoURL', {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
res.send('Hello World! My first Node JS! Hahaha')
})

app.post('/register', (req,res) => {
  //회원 가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.
  const user =  new User(req.body)

  // save()는 몽고디비에서 넘어오는 메소드로, 넘어오는 정보들이 User 모델에 저장됨.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err})   // 에러나면 에러 메시지와 성공여부 실패로 넘김
    return res.status(200).json({ // 아니면 200(성공)으로 보냄
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`)
})