const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const fs = require("fs/promises"); // Using promises version of fs

const app = express();
const upload = multer();
app.use(express.static(path.join(__dirname,'public')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load credentials and set up Google Drive API
const KEYFILEPATH = path.join(__dirname, "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

// Configure nodemailer with your email service provider
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'everlastingmomentshub@gmail.com', 
        pass: 'ltuq okjn cyxj rudz', 
    },
});

// Track submitted emails to avoid duplicates
let submittedEmails = new Set();

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

// Handle form submission for files
app.post("/upload", upload.any(), async (req, res) => {
    try {
        const { body, files } = req;
        const userEmail = body.email;

        // Check if email is provided
        if (userEmail && !submittedEmails.has(userEmail)) {
            // Save email to submitted list
            submittedEmails.add(userEmail);

            // Save email to a text file on Google Drive
            await saveEmailToDrive(userEmail);

            // Send a thank-you email
            await sendThankYouEmail(userEmail);
        }

        // Upload files to Google Drive
        for (let f = 0; f < files.length; f += 1) {
            await uploadFile(files[f]);
        }

        res.status(200).send("Form Submitted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Handle email submission
app.post("/submitEmail", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided and not a duplicate
        if (email && !submittedEmails.has(email)) {
            // Save email to submitted list
            submittedEmails.add(email);

            // Save email to a text file on Google Drive
            await saveEmailToDrive(email);

            // Send a thank-you email
            await sendThankYouEmail(email);

            res.status(200).send("Email Submitted");
        } else {
            res.status(400).send("Invalid or duplicate email");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Function to upload a file to Google Drive
const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: ["16t3GlSNMyp5kqhaxQ5xl8076J8NF4LVs"],
        },
        fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
};

// Function to save email to a text file on Google Drive
// Function to save email to a text file on Google Drive
const saveEmailToDrive = async (email) => {
    try {
        // Check if file already exists
        const fileList = await google.drive({ version: "v3", auth }).files.list({
            q: "name='emails.txt' and '16t3GlSNMyp5kqhaxQ5xl8076J8NF4LVs' in parents",
        });

        let existingContent = "";

        if (fileList.data.files.length > 0) {
            // File exists, read its content
            const fileId = fileList.data.files[0].id;
            const response = await google.drive({ version: "v3", auth }).files.get({ fileId, alt: "media" });
            existingContent = response.data;

            // Check if the email is already present
            if (existingContent.includes(email)) {
                console.log(`Email ${email} already exists in emails.txt. Skipping.`);
                return;
            }
        }

        // Append the new email
        const updatedContent = existingContent + email + "\n";

        // Upload the updated content to Google Drive
        const bufferStream = new stream.PassThrough();
        bufferStream.end(updatedContent);

        if (fileList.data.files.length > 0) {
            // Update existing file
            await google.drive({ version: "v3", auth }).files.update({
                fileId: fileList.data.files[0].id,
                media: {
                    mimeType: "text/plain",
                    body: bufferStream,
                },
            });
        } else {
            // Create a new file
            await google.drive({ version: "v3", auth }).files.create({
                media: {
                    mimeType: "text/plain",
                    body: bufferStream,
                },
                requestBody: {
                    name: "emails.txt",
                    parents: ["16t3GlSNMyp5kqhaxQ5xl8076J8NF4LVs"],
                },
                fields: "id,name",
            });
        }

        console.log(`Saved email to Google Drive: ${email}`);
    } catch (error) {
        console.error(`Error saving email to Google Drive:`, error);
    }
};


// Function to send a thank-you email
const sendThankYouEmail = async (email) => {
    const mailOptions = {
        from: 'everlastingmomentshub@gmail.com', // Your Gmail email address
        to: email,
        subject: 'Thank You for Attending the Wedding',
        text: 'Dear guest,\n\nThank you for attending the wedding! We appreciate your presence. Hope you enjoyed celebrating with us. I personally thank you for capturing the moments and sharing it with us. We will be sending the link shortly after the marriage of all the moments that has been shared with us.\n\n\n Once again, Thank you for being part of our "EVERLASTING MOMENTS"..... \n\n Regards,\nPatel Family. ',
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Sent thank-you email to: ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
    }
};

//The rent al page backend


const bodyParser = require('body-parser');




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/process_form', (req, res) => {
  const { name, email2, message } = req.body;

  // Check if the form fields are present
  if (!name || !email2 || !message) {
    return res.status(400).send('Incomplete form data');
  }

  // Compose email subject and body
  const subject = 'New Rental Inquiry';
  const body = `Name: ${name}\nEmail: ${email2}\nMessage:\n${message}`;

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'everlastingmomentshub@gmail.com',
      pass: 'ltuq okjn cyxj rudz'
    }
  });

  // Configure email options for user
  const userMailOptions = {
    from: 'everlastingmomentshub@gmail.com',
    to: email2,
    subject: 'Thank you for your inquiry',
    text: 'Thank you for your inquiry. Here is the details regarding the rental service of the website. The total cost would be 4000Rs and we will be asking for your Google drive\'s id and password in order to save the pictures and videos on it. With a descent amount this service can be part of your wedding as well and make it more memorable with everlastingmoments.Thank you for showing your interest. \n Regards, \n The everlasting team.'
  };

  // Send email to user
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to user:', error);
    } else {
      console.log('Email sent to user:', info.response);
    }
  });

  // Configure email options for admin
  const adminMailOptions = {
    from: 'everlastingmomentshub@gmail.com',
    to: 'kushp7781@gmail.com',
    subject: subject,
    text: body
  };

  // Send email to admin
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to admin:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent to admin:', info.response);
      //res.send('Email sent successfully');
    }
  });
});






// Start the server
app.listen(5050, () => {
    console.log('Form running on port 5050');
});
