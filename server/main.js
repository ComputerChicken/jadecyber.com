const express = require('express');
const fs = require('node:fs/promises');
const cors = require('cors');

const app = express();
const port = 21478;

app.use(cors());

app.use(express.json());

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thedarraghbennett@gmail.com',
    pass: 'oisrgbmluuwarmpv'
  }
});

async function writeTextFile(name, content) {
    console.log("Recieved plan form from: " + name)
    try {
        await fs.writeFile(name + '.txt', content, 'utf8');
        console.log('File written successfully!');
        console.log("Notifying myself...")
        const mailOptions = {
            from: '"Darragh Bennett" <thedarraghbennett@gmail.com>',
            to: 'thedarraghbennett@gmail.com',
            subject: 'Yo someone bought something',
            text: 'Name:' + name + "\nContent: " + content
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error occurred: ' + error.message);
            }
            console.log('Email sent successfully! Message ID: ' + info.messageId);
        });
        return true;

    } catch (err) {
        console.error('Error writing file:', err);
        return false;
    }
}

app.post('/submit', async (req, res) => {
    const body = req.body;
    console.log(body)
    const content = [body.name, body.plan, body.email, body.phone, body.webapp, body.notes].join("\n")
    res.send(await writeTextFile(body.name, content));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
