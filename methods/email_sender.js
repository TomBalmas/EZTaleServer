const nodemailer = require("nodemailer");
const ical = require("ical-generator");
const moment = require("moment");

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "eztaleproject@gmail.com",
    pass: "uomelzvcvrcjfhod",
  },
});

function getIcalObjectInstance(
  description,
  username,
  mainWriterEmail,
  dueDays
) {
  const cal = ical({});
  cal.createEvent({
    start: moment(),
    end: moment(dueDays, "days"),
    summary: "You got a due time for writing",
    description: description,
    organizer: {
      name: username,
      email: mainWriterEmail,
    },
  });
  return cal;
}

var functions = {
  sendHelloMsg: (req, res) => {
    var mailOptions = {
      to: req.body.email,
      subject: "Welcome to EZTale!",
      html: `<h1>Hello ${req.body.name} ${req.body.surname} Welcome to Our application</h1>
                <body>
                    <p>
                        Hi, welcome to EZTale,<br>
                        You are now a new member of the application <br>
                        Have fun and create nice books :)
                    </p>
                </body>`,
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) console.log(error);
      else console.log("Message sent: ", response);
    });
  },
  sendDueCalendar: (req, res) => {
    var calObj = getIcalObjectInstance(
      req.body.description,
      req.body.username,
      req.body.email,
      req.body.deadLine
    );
    mailOptions = {
      to: req.body.coUsernameEmail,
      subject: `New ${req.body.bookName} deadline!`,
      html: req.body.description,
    };
    if (calObj) {
      let alternatives = {
        "Content-Type": "text/calendar",
        method: "REQUEST",
        content: calendarObj.toString(),
        component: "VEVENT",
        "Content-Class": "urn:content-classes:calendarmessage",
      };
      mailOptions["alternatives"] = alternatives;
      mailOptions["alternatives"]["contentType"] = "text/calendar";
      mailOptions["alternatives"]["content"] = calendarObj.toString();
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) console.log(error);
      else console.log("Message sent: ", response);
    });
  },
  sendCoWriterInvite: (code, email, username, bookName, coUsername) => {
    var mailOptions = {
      to: email,
      subject: `You got invitation to book: ${bookName} by ${username}`,
      html: `<h1>Hello ${coUsername} you got a new invitation </h1>
                <body>
                    <p>
                        The invitation code is: ${code} <br>
                        Please go to Co-Writers page and accept the code. <br>
                        After you insert the code the book will be added to your books list <br>
                        as a Co-Book, you will get deadlines from the main writer. <br>
                        Enjoy!
                    </p>
                </body>`,
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) console.log(error);
      else console.log("Message sent: ", response);
    });
  },
};

module.exports = functions;
