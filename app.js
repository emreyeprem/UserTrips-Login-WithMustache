const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const PORT = 3007
var session = require('express-session')

 app.use(express.static('css'))
 app.use(bodyParser.urlencoded({ extended: false }))
 app.engine('mustache',mustacheExpress())
 app.set('views','./views')
 app.set('view engine','mustache')

 app.use(session({
  secret: 'kitten',
  resave: false,
  saveUninitialized: false
}))
//------middle ware--to put control of user on pages add_trips and tripsDisplay-----
let authenticateLogin = function(req,res,next) {

  // check if the user is authenticated
  if(req.session.username) {
    next()
  } else {
    res.redirect("/")
  }

}
app.all("/user/*",authenticateLogin,function(req,res,next){
    next()
})
//----------------------------
let userList = []
app.get('/',function(req,res){
  res.render('login')
})

app.post('/register',function(req,res){
  let userName = req.body.username
  let passWord = req.body.password
  let user = {userName : userName, passWord : passWord}
 userList.push(user)
 console.log(userList)
 res.redirect('/')
})

app.post('/login',function(req,res){
  let username = req.body.username
  let password = req.body.password

let userId =  userList.find(function(user){
    return user.userName == username && user.passWord == password
  })
  console.log(userId)
  if(userId != null){
    req.session.username = username  //sagdaki username login'den gelen userName
    res.redirect('/user/tripsDisplay')
  }

})

app.get("/user/logout",function(req,res){
  req.session.destroy()
  res.redirect("/")
})


// ******************************************************
 // app.get('/',function(req,res){
 //   res.send(('Hello World'))
 // })
app.get('/user/add_trips',function(req,res){
  res.render('add_trips')
})

app.post('/user/add_trips',function(req,res){
  let tripLocation = req.body.tripLocation
  let tripDepartureDate = req.body.tripDepartureDate
  let tripReturnDate = req.body.tripReturnDate
  let tripLocationImage = req.body.tripLocationImage
  let username = req.session.username
      tripsOfUser.push({username : username, tripLocation : tripLocation, DepartureDate : tripDepartureDate, ReturnDate : tripReturnDate, Poster : tripLocationImage})
  res.redirect('/user/tripsDisplay')
})
let tripsOfUser = []
app.get("/user/tripsDisplay",function(req,res){
   let userTrips = tripsOfUser.filter(function(each){
     return each.username == req.session.username
   })
   res.render('tripsDisplay',{tripList : userTrips})
})



app.post('/delete_trip',function(req,res){
  let locationName = req.body.locationName
  let userId = req.body.userId
  tripsOfUser = tripsOfUser.filter(function(trip){
    return !(trip.tripLocation == locationName && trip.username == userId)
  })
  res.redirect('/user/tripsDisplay')
})

// ========================================================
app.listen(PORT,function(){
   console.log("Server is running..")
})
// app.get('/',function(req,res){
//   res.render('movieSite',{movieList : movies})
// })
// app.get('/',function(req,res){
//   res.json({name:"Emre"})
// })

// app.get('/movies/:genre',function(req,res){
//
//   let genre = req.params.genre
// let moviesByGenre = movies.filter(function(each){
// return genre == each.Category
// })
// res.render('movieSite', {movieList:moviesByGenre})
// })
