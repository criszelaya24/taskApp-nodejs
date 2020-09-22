module.exports = (res, error) => {
    res.status(400).send({
        error: error.message || error,
    });
};