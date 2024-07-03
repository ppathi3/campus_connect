// General site navigation controller
// GET /: renders landing page to the user
exports.index = (req, res) => {
    res.render('index');
};

// GET /about: renders about page to the user
exports.about = (req, res) => {
    res.render('about');
};

// GET /contact: renders contact page to the user
exports.contact = (req, res) => {
    res.render('contact');
};

