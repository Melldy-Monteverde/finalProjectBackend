const { Router } = require('express')
const path = require('path')
const router = Router()
const products = []

const dataPath = path.join(__dirname, '../data.json')

// instances of class
const ProductManager = require('../productManager/productManager')
const prodManager = new ProductManager(dataPath)

// /api/products/
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit)
  const products = await prodManager.getAllProd()
  const limitedProducts = products.slice(0, limit)

  return limit
    ? res.status(200).json({ ok: true, products: limitedProducts, queryParams: req.query })
    : res.status(200).json({ ok: true, products: products })
})

// /api/products/:pId
router.get('/:pId', async (req, res) => {
  const pId = Number(req.params.pId)
  const product = await prodManager.getProdById(pId)

  return !product
    ? res.status(404).json({ message: `product with id: ${pId} not found [!]`, id: pId })
    : res.status(200).json({ ok: true, product: product })
})

// api/products
router.post('/', async (req, res) => {
  const { title, description, category, price, stock, code } = req.body;
  const addProd = await prodManager.addProd(req.body)

  if (!addProd) {
    return res.status(400).json({
      ok: true,
      message: 'can not add the product because some property is empty or the product code already exists',
      errorType: `${code} already exists`,
      product: req.body
    })
  } else {
    products.push(addProd)
    return res.status(200).json({
      ok: true,
      message: 'the product was successfully added',
      product: req.body
    })
  }
})

router.put('/:pId', async (req, res) => {
  await prodManager.updProd(Number(req.params.pId), req.body)
  return res.status(200).json({
    ok: true,
    message: 'product updated successfully',
    reqBody: req.body
  })
})

router.delete('/:pId', async (req, res) => {
  await prodManager.delProdById(Number(req.params.pId))
  return res.status(200).json({
    ok: true,
    message: 'product deleted successfully',
    reqParam: req.params
  })
})
module.exports = router
