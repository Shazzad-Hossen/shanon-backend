const nodemailer = require("nodemailer");
module.exports=function(settings){

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        auth: {
          user: settings.SMTP_USER,
          pass: settings.SMTP_PASSWORD,
        },
      });

      console.log('=> Mail service started');

    return async function sendMail ({receiver, subject, body,type}) {
            try {
                const msgObj={
                    from: `${settings.EMAIL_NAME} <${settings.EMAIL_FROM}>`,
                    to:receiver,
                    subject,
                }
                if(type==="html") msgObj.html=body;
                else msgObj.text=body;
                const info = await transporter.sendMail(msgObj);
                console.log("Message sent: %s", info.messageId);
                return info;
            } catch (error) {
                console.error(error);
                return error;
            }
        

}
}