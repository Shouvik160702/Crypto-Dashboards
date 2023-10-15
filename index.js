const express = require('express')
const app = express()
const port = 3000
var request = require('request')
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');


app.use(bodyParser.json());  // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(upload.array());

let marketdata= ""
let coinname="bitcoin"
let marketchart = ""

async function resdata(coinname){
  var mdata = await new Promise((resolve,reject) =>{
request('https://api.coingecko.com/api/v3/coins/' + coinname, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  marketdata= JSON.parse(body)
  resolve(marketdata)
});
})

if(mdata){

var mchart = await new Promise((resolve,reject) =>{
  request('https://api.coingecko.com/api/v3/coins/' + coinname + '/market_chart?vs_currency=usd&days=30', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    marketchart= JSON.parse(body)
    //console.log(marketchart)
    resolve(marketdata)
  });
  })
}

}

app.get('/', async(req, res) => {
  await resdata(coinname)
  res.render('index',{marketdata,marketchart})
})

app.post('/',async(req,res) =>{
  coinname = req.body.selectcoin;
  await resdata(coinname)
  res.render('index',{marketdata,marketchart})
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})