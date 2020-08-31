module.exports = (res, error) => {
    res.send(400, {
        error: error,
    });
};