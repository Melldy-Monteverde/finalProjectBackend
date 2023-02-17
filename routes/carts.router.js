const { Router } = require('express')
const path = require('path')
const router = Router()
const dataPath = path.join(__dirname, '../cartsDB.json')

const CartManager = require('../cartManager/cartManager')

const cartManager = new CartManager(dataPath)

router.post('/', async (req, res) => {
  await cartManager.addCart()
  res.status(200).json({
    ok: true,
    message: 'cart added sussccefully'
  })
})

router.get('/:cId', async (req, res) => {
  const products = await cartManager.getProdsByCartId(Number(req.params.cId))
  return !products
    ? res.status(400).json({ ok: true, message: `cart not with id: ${req.params.cId} found` })
    : res.status(200).json({ ok: true, products: products })
})

router.post('/:cId/product/:pId', async (req, res) => {
  await cartManager.addProdToCart(Number(req.params.cId), Number(req.params.pId))
  res.status(200).json({ ok: true, message: `product with id: ${req.params.pId} added sussccefully` })
})

module.exports = router
