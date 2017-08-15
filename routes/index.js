/*
 * GET home page.
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'Hypertube', layout: 'index-layout' })
    });
    app.get('/login', function (req, res) {
        res.render('login', { title: 'Hypertube', layout: 'login-layout' })
    });
}