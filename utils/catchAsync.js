module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // Calls the next with the parameter it receives
    }
}