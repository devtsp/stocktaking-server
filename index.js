require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const logger = require('./middleware/logger');
const verifyJWT = require('./middleware/verifyJWT');
const handleErrors = require('./middleware/handleErrors');

const app = express();
const PORT = process.env.PORT || 5000;

//MIDDLEWAR
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

//ROUTES
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//AUTH
app.use(verifyJWT);
app.use('/transactions', require('./routes/api/transactions'));

//404
app.all('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: '404 Not Found' });
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.use(handleErrors);

app.listen(PORT, () => console.log(`>> Listening on port ${PORT}`));
