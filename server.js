const express = require('express')
const body_parser = require('body-parser')
const webhoseio = require('webhoseio')
const path = require('path')
const app = express()
app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())

app.listen(8000)

const client = webhoseio.config({token: '00752508-522f-4c87-bb27-2952f6fdab97'});


app.get('/wishes', (request, response) => {
  console.log('asddsdads');
  response.json({name: "blue dress", price: "30", image: "das.jpg"})
})

app.get('/dress', (request, response) => {
  var query_params = { "q": "" }
  var word = ""
  var categories = []
  for (value of request.query.categories) {
    if(value == " ") {
      if(word) { categories.push(word)  }
      word = ""
    } else {  word += value  }
  }

  if (request.query.name) {
    query_params.q +=  `name: (${request.query.name}) `
    if (request.query.brand) {
      query_params.q +=  `brand: (${request.query.brand})`
    }
    if (categories) {
      for (value of categories) {
        query_params.q += ` category:${value}`
      }
    }
    console.log(query_params);
    client.query('productFilter', query_params)
    .then(output => {
      var result = ''
      if(output['products']) {
        for (var i = 0; i < output['products'].length; i++) {
          result += `${output['products'][i]['name']} >?< ${output['products'][i]['price']} >?< ${output['products'][i]['images'][0]} >?<`
        }
      }
      response.json(result)
    });
  } else {
    response.json(false)
  }

})
