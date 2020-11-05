const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리를 하는 곳

    // 1. 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.test_auth;

    // 2. 토큰 복호화 후 유저 찾기
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        // 3. 유저가 없으면 Nope!
        if(!user) return res.json({isAuth: false, error: true})
        // 4. 유저가 있으면 인증 Okay
        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };