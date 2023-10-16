const jwt=require("jsonwebtoken")
const jwtsecret="0612ad6d7052a272cebce186435b76ab903a36a70b649b9f53988afb7efbf77e0c14ecf294cf16ce35f3bd96cf9ba79decbf008a5054f5438c06c85dda036e04"
function auth(req, res, next){
    const client=req.cookies.jwttoken
    try{
        const user=jwt.verify(client, jwtsecret)
        req.user=user
        next()
    }catch(e){
        console.log('JWT Token Error:', e)
        res.clearCookie("jwttoken")
        return res.redirect("/login")
    }
}
module.exports={auth}