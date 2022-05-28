require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

//MIDDLEWARE
app.use(logger);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ROUTES
app.use('/', require('./routes/root'));
app.use('/transactions', require('./routes/transactions'));
app.use('/register', require('./routes/register.js'));

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

app.listen(PORT, () => console.log(`>> Listening on port ${PORT}`));
