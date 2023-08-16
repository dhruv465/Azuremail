const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { EmailClient } = require("@azure/communication-email");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient('endpoint=https://niri-comunication-service.unitedstates.communication.azure.com/;accesskey=f6QfpG8QEhVLRU5QjrMo+KqV+FCdibgIs3OLeypn5TnWXv/OySLA12BMtR+9Fmu5UYhZK3sgX4iLljAr4A09bw==');

app.post('/send-email', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const messagePayload = {
      senderAddress: "DoNotReply@194aafb5-36df-488c-aaa1-f9e5f9c7b162.azurecomm.net",
      content: {
        subject,
        plainText: message,
      },
      recipients: {
        to: [
          {
            address: email,
          },
        ],
      },
    };

    const poller = await emailClient.beginSend(messagePayload);

    let timeElapsed = 0;
    while (!poller.isDone()) {
      poller.poll();
      console.log("Email send polling in progress");

      await new Promise(resolve => setTimeout(resolve, 2 * 1000));
      timeElapsed += 2;

      if (timeElapsed > 30) {
        throw new Error("Polling timed out.");
      }
    }

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
