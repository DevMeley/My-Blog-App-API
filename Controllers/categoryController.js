const Category  = require("../Models/Category")

// @desc create category
// @route categories/create
// @access private
const createCategoriesHandler = async (req, res) => {
    try {
        const {name} = req.body 
        if (typeof name !=="string") {
            return res.status(400).json({
                message:"Category name must be a string"
            })
        }
        const category = await new Category({
            name: name
        })
        const newCategory = await category.save()
        res.status(200).json(newCategory)        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// @desc retrieve categories
// @route GET /categories
// @access public
const getCategoryHandler = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


module.exports = {createCategoriesHandler, getCategoryHandler}