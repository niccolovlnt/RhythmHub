const jwt=require("jsonwebtoken")
const jwtsecret="0612ad6d7052a272cebce186435b76ab903a36a70b649b9f53988afb7efbf77e0c14ecf294cf16ce35f3bd96cf9ba79decbf008a5054f5438c06c85dda036e04"
function auth(req, res, next){
    client=req.cookies.token
    console.log(client)
    if(client==null){
        console.log("cisone")
        res.redirect("/login")
        return
    }
    try{
        console.log("cerco")
        const user=jwt.verify(client, jwtsecret)
        req.user=user
        
    }catch(e){
        console.log('JWT Token Error:', e)
        res.clearCookie("token")
        return res.redirect("/login")
    }
    next()
}
module.exports={auth}