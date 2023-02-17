const fs = require('fs/promises');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = []
  }

  async idGnerator(prodList) {
    try {
      return (prodList.length === 0)
        ? 1
        : prodList[prodList.length - 1].id + 1;
    } catch (error) {
      console.log(error)
    }
  }

  async getAllProd() {
    try {
      const prodListDB = await fs.readFile(this.path, 'utf-8');
      // console.table(prodListDB);
      return prodListDB.length === 0
        ? console.log('there are not products to display')
        : JSON.parse(prodListDB)
    } catch (error) {
      console.log(error);
    }
  }

  async getProdById(id) {
    try {
      const prodListDB = await this.getAllProd()
      const prodFound = prodListDB.find(p => p.id === id)
      return prodFound
        ? prodFound
        : console.log(`product with id: ${id} not found`);
    } catch (error) {
      console.log(error);
    }
  }

  async addProd(prod) {
    try {
      const prodListDB = await this.getAllProd()
      const newId = await this.idGnerator(prodListDB)
      if (
        !prod.code ||
        !prod.title ||
        !prod.description ||
        !prod.category ||
        !prod.price ||
        !prod.stock
      ) {
        throw new Error('some product properties are empty')
      } else if (prodListDB.some(p => p.code === prod.code)) {
        console.log(`product with code: ${prod.code} already exists`)
      } else {
        prodListDB.push({ id: newId, ...prod })
        await fs.writeFile(this.path, JSON.stringify(prodListDB, null, 2))
        return `product with id: ${newId} add successfully`
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updProd(id, data) {
    try {
      const prodListDB = await this.getAllProd()
      const prodId = await this.getProdById(id)
      if (!prodId) return 'Product no found!'
      let prodIndex = prodListDB.findIndex(p => p.id === id)
      prodListDB[prodIndex] = { ...prodId, ...data }
      await fs.writeFile(this.path, JSON.stringify(prodListDB, null, 2))
      return console.table(prodListDB)
    } catch (error) {
      console.log(error)
    }
  }

  async delProdById(id) {
    try {
      const prodListDB = await this.getAllProd()
      const prodFiltered = await prodListDB.filter(p => p.id !== id)
      await fs.writeFile(this.path, JSON.stringify(prodFiltered, null, 2))
      // console.table(prodFiltered)
      return `product with id: ${id} removed successfully`
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ProductManager
