const fs = require('fs/promises');
const path = require('path')

const dataPath = path.join(__dirname, '../data.json')

const ProductManager = require('../productManager/productManager')
const prodManager = new ProductManager(dataPath)

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = []
  }

  async idGnerator(cartList) {
    try {
      return (cartList.length === 0)
        ? 1
        : cartList[cartList.length - 1].id + 1;
    } catch (error) {
      console.log(error)
    }
  }

  async getAllCarts() {
    try {
      const cartListDB = await fs.readFile(this.path, 'utf-8')
      console.table(cartListDB)
      return cartListDB.length === 0
        ? console.log('there are not carts to display')
        : JSON.parse(cartListDB)
    } catch (error) {
      console.log(error)
    }
  }

  async getProdsByCartId(id) {
    try {
      this.carts = await this.getAllCarts()
      return this.carts.find(cart => cart.id === id).products
    } catch (error) {
      console.log(error)
    }
  }

  async addCart() {
    try {
      const cartListDB = await this.getAllCarts()
      const newId = await this.idGnerator(cartListDB)
      cartListDB.push({ id: newId, products: [] })
      await fs.writeFile(this.path, JSON.stringify(cartListDB, null, 2))
      return `cart with id: ${newId} add successfully`
    } catch (error) {
      console.log(error)
    }
  }

  async addProdToCart(cId, pId) {
    try {
      const prod = await prodManager.getProdById(pId)
      const cart = await this.getProdsByCartId(cId)
      if (cart.some(item => item.product === prod.id)) {
        const index = cart.findIndex(item => item.product === prod.id)
        cart[index].quantity++
      } else {
        cart.push({ product: prod.id, quantity: 1 });
      }
      return await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = CartManager
