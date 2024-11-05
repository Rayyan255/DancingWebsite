const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 8000;

// Connect to the MongoDB database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/contactdance', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("We are connected");
}
main().catch(err => console.log(err));

// Define mongoose schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    message: String,
});

// Create the Contact model using the defined schema
const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); // For serving static files
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

// PUG SPECIFIC STUFF
app.set('view engine', 'pug'); // Set the template engine as Pug
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render('index.pug');
});

// Handle contact form submission
app.post('/send-message', async (req, res) => {
    const { name, email, address, message } = req.body;

    // Create a new contact document
    const newContact = new Contact({ name, email, address, message });
    await newContact.save(); // Save to the database

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    
    // Redirect or respond to the user
    res.redirect('/'); // Redirect to the homepage after submission
});

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});