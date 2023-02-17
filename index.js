const express = require('express')
const app = express()
const productRoutes = require('./routes/products.router')
const cartRoutes = require('./routes/carts.router')

const PORT = process.env.PORT || 8080
const API_PREFIX = 'api'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get(`/${API_PREFIX}/alive`, (req, res) => {
  res.json({ ok: true, message: 'root ok!' })
})

app.use(`/${API_PREFIX}/products`, productRoutes)
app.use(`/${API_PREFIX}/carts`, cartRoutes)

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`))
