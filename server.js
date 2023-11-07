const app = require('./index'); 
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))

const port = 3000
app.listen(port, () => 
    console
      .log(`Server run at http://localhost:${port}
    `))