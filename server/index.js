const express = require('express')
const app = express()
const port = 5000

// bodyParser가 있기 때문에 request에서 넘어오는 것을 req.body로 받을 수 있음
const bodyParser = require('body-parser');

// 토큰 쿠키 저장용
const cookieParser = require('cookie-parser');

// 몽고디비 계정 보호를 위해 따로 키 관리함(개발/운영)
const config = require('./config/key');

// 인증처리
const{ auth } = require("./middleware/auth");

const { User } = require("./models/User");

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended:true}));

//application/json 타입으로 된 것을 분석해서 가져올 수 있게 함
app.use(bodyParser.json());

// 쿠키파서
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
res.send('Hello World! My first Node JS! Hahaha')
})

app.post('/api/users/register', (req,res) => {
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


app.post('/api/users/login',(req,res) => {
  //1. 요청 이메일을 데이터베이스에서 찾는다.
  User.findOne({email:req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "입력하신 이메일에 해당하는 유저가 없습니다."
      })
    }

  //2. 데이터베이스에 있다면 비번이 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({loginSuccess: false, message: "비밀번호가 일치하지 않습니다."})

  //3. 비번까지 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키 또는 로컬스토리지 등! 
        // 일단 쿠키에 저장하려면 npm install cookie-parser --save 한 후 위에 선언.
        res.cookie("test_auth", user.token)   //쿠키명은 임의작성
        .status(200)
        .json({loginSuccess: true, userId: user._id})

      })
    })
  })
})

app.get('/api/users/auth', auth,(req,res) => {
  // 여기까지 왔으면 미들웨어를 통과했다는 것이고 Authentication이 true라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,    // 임의 조작 가능. 현재는 role이 0이면 일반유저, 아니면 관리자로 지정해놓음
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.get('/api/users/logout', auth,(req, res) => {
  User.findOneAndUpdate(
    {_id: req.user._id},
    {token: ""}
    ,(err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success:true
      })
    } )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`)
})