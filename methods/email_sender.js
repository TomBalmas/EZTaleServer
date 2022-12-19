const nodemailer = require("nodemailer");
const ical = require('ical-generator');
const moment = require('moment');

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "eztaleproject@gmail.com",
        pass: "uomelzvcvrcjfhod"
    }
});

function getIcalObjectInstance( description, username ,mainWriterEmail, dueDays) {
    const cal = ical({ domain: "mytestwebsite.com", name: 'My test calendar event' });
    cal.domain("mytestwebsite.com");
    cal.createEvent({
            start: moment(),      
            end: moment(dueDays,'days'),            
            summary: 'You get a due time for writing',        
            description: description,
            organizer: {              
                name: username,
                email: mainWriterEmail
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
                        Hi, welcome to EZTale,\n
                        You are now a new member of the application \n
                        Have fun and create nice books :)
                    </p>
                </body>`}

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error)
                console.log(error);
            else
                console.log("Message sent: ", response);
        });
    },
    sendDueCalendar: (req,res) => { 
        var calObj = getIcalObjectInstance(req.body.description,req.body.username,
            req.body.email,req.body.deadLine);
        mailOptions = {
            to: req.body.coUsernameEmail,
            subject: `New ${req.body.bookName} deadline!`,
            html: req.body.description
        }
        if(calObj) {
            let alternatives = {
                "Content-Type": "text/calendar",
                "method": "REQUEST",
                "content": calendarObj.toString(),
                "component": "VEVENT",
                "Content-Class": "urn:content-classes:calendarmessage"
            }
            mailOptions['alternatives'] = alternatives;
            mailOptions['alternatives']['contentType'] = 'text/calendar'
            mailOptions['alternatives']['content'] = calendarObj.toString()
        }
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) 
                console.log(error);
            else 
                console.log("Message sent: " , response);
        });
    }
}

module.exports = functions;

