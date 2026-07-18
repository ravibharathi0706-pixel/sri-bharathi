const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, 'messages.json');

const readMessages = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error reading messages:', err);
    }
    return [];
};

const writeMessages = (messages) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
};

app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const entry = {
        id: Date.now(),
        name,
        email,
        subject: subject || '',
        message,
        receivedAt: new Date().toISOString()
    };

    const messages = readMessages();
    messages.push(entry);
    writeMessages(messages);

    console.log(`New enquiry from ${name} <${email}>`);
    res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
});

app.get('/api/messages', (req, res) => {
    const messages = readMessages();
    res.json(messages);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
