const jwt = require('jsonwebtoken');
const { getUsuario } = require('../models/usuario');

const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.status(401).json({ error: 'Unauthorized access' });
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.status(401).json({ error: 'Unauthorized access' });
    }
};

const checkIfAdmin = (req, res, next) => {
    var token = req.headers['authorization'];

    if (token) {
        //removes Bearer
        token = token.split(' ')[1];
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err) {
              next();  
              return res.status(401).json({ error: 'Unauthorized access' });
            }
            else {
                console.log(decodedToken);

                try {
                    let admin = await getUsuario(decodedToken.id);

                    if (admin.isAdmin) {
                        next();
                    }
                    else {
                        return res.status(401).json({ error: 'Unauthorized access' });
                    }
                }
                catch(err) {
                    console.log(err);
                    return res.status(500).json({ error: err });
                }
            }
        });
    }
    else {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
}

module.exports = { requireAuth, checkIfAdmin };