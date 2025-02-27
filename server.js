// server.js
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid'); // Install: npm install shortid
const ShortUrl = require('./models/shortUrl');

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://musaddiqeadil:25z2oAsxo89osXAQ@cluster0.p4lpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Set view engine
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find();
        res.render('index', { shortUrls: shortUrls });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/shortUrls', async (req, res) => {
    try {
        const shortId = shortid.generate(); // Generate a unique short ID
        await ShortUrl.create({ full: req.body.fullUrl, short: shortId });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
        if (shortUrl == null) return res.sendStatus(404);

        shortUrl.clicks++;
        await shortUrl.save();

        res.redirect(shortUrl.full);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});