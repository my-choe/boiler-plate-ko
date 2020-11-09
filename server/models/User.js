const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10  // salt를 10자로 제한
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlenth: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlenth: 5
    },
    lastname: {
        type: String,
        maxlenth: 70
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// pre(몽구스에서 가져온 메소드).save 하기 전에 function주기. 다 끝나면 next 로 보내기
userSchema.pre('save', function(next){
    var user = this;    //넘어온 유저 객체 생성

    //비밀번호를 수정했을 때에만 암호화
    if(user.isModified('password')){
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){   // (기존 비번, 위에서 생성된 salt, function(err, hash는 암호화 된 비밀번호)
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword과 암호화된 디비 비밀번호가 일치하는 지 확인
    // plainPassword를 암호화 시킨 후 일치확인
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    // jsonwebtoken을 이용해서 token을 생성하기
    var user = this;
    var token =  jwt.sign(user._id.toHexString(),'secretToken')    // 몽고디비의 _id와 뒤의 단어를 조합한 토큰 만들어짐. secretToken대신 다른 문자열 넣어도 됨. 기억해야 함.
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)  // 에러나면 에러 전달
        cb(null, user)  // 아니면 유저 정보 전달
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 후 
        // 클라이언트에서 가져온 토큰과 db에 보관된 토큰 일치여부 확인
        user.findOne({"_id": decoded, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }