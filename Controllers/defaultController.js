const defaultHandler = async (req, res) => {
    try {
        res.status(200).json({
            message: "This is the default route"
        })
    } catch (error) {
        return res.status(500).json({
            Message: error.Message
        })
    }
}

module.exports = defaultHandler