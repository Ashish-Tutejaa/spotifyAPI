const print = console.log;
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const qs = require('querystring');
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"))
app.set('view engine','hbs')

app.get('/loggedin', (req,res,next) => {

    print('logged in ')

    if(req.query.error || req.query.code == null) {
        res.send("<html><h1>Failed to login!</h1><br></br><a href='http://localhost:53489'>Click here to go back!</a></html>")
    } else {
        print("Code is: ", req.query.code);
        var options = {
            url : "https://accounts.spotify.com/api/token",
            method : "POST",
            form : {
                grant_type : "authorization_code",
                code : req.query.code,
                redirect_uri : "http://localhost:5000/loggedin",
            },
            headers : {
                Authorization : "Basic " + (new Buffer("f79e1fa09580492f8430e3539cb9b0ea" + ':' + "4136ebf178b84cc0a76f722663aa1326").toString('base64'))
            }
        }
        request(options, (err,resp,body) => {
            //we have the access token via body.access_token.
            body = JSON.parse(body);
            print(body)
            res.render('choice',{
                token : body.access_token
            })
            // res.redirect(`http:localhost/53489/choice?token=${body.access_token}`)
            // res.send(`<html><h1>Login Successful!</h1><br></br>
            // <a href='http://localhost:53489/artists?token=${body.access_token}'>Artists.</a>
            // <br></br>
            // <a href='http://localhost:53489/devices?token=${body.access_token}'>Devices</a>
            // <br></br>
            // <a href='http://localhost:53489/genres?token=${body.access_token}'>Genres</a>
            // </html>`)
        })
    }
})

app.get('/login', (req,res,next) => {

    var APIScopes = "user-modify-playback-state user-read-playback-state user-top-read user-follow-read user-library-read";

    res.redirect("https://accounts.spotify.com/authorize?" + qs.stringify({
        client_id : "f79e1fa09580492f8430e3539cb9b0ea",
        response_type : "code",
        redirect_uri : "http://localhost:5000/loggedin",
        scope : APIScopes,
        show_dialog : true
    }))
})

app.get('/*', function (req, res) {
    res.sendres.send("<html><h1>Error 404 path not found!</h1><br></br><a href='http://localhost:53489'>Click here to go back!</a></html>")
  });  

app.listen(5000, () => {
    print("running @ 5000")
})