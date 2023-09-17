const moment = require("moment");
import axios from "axios";

export const DataConvert = (date, par = 0) => {
  const d = new Date(date);
  d.setDate(d.getDate() + par);

  return d.toDateString();
};
export const TimeConverter = (time) => {
  const d = new Date(time);
  return d.toTimeString().slice(0, 8);
};

const constructHTML = (emailDetails) => {
  const { type, title } = emailDetails;
  let emailContent = "";

  if (type === "referral") {
    const { user } = emailDetails;
    emailContent = `
  <div style='height: 300px;
  width: 550px;

  align-items: center;
  justify-content: center;
  text-align: center;
  background: #f1f3f4'>
  <h1>Trades Trek Invitation</h1>

  <p>Hello</p>

  <p>We are excited to inform you that ${user.firstName} ${user.lastName} has invited you to join Trades Trek.</p>

  <p> Click <a href='https://trades-trek-client.vercel.app/sign-up/?reffercode=${user.yourRefferal}'>  here to register </a> </p>

  <p> We can’t wait to welcome you </p>

  </div>
 
          `;
  }

  if (type === "password-reset-success") {
    emailContent = `    <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #FBF8FF;" width="600">
    <tbody>
        <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
                <h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif;  text-decoration: none; color: #2E2E2E; text-align: left">Hello<span style='font-weight: 600'> ${title}</span> </h1>
                <div style="padding: 10px; background: white; font-family: Poppins;"> <img style="" src="https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/walkingIllustration.png?alt=media&token=ada819cd-2d92-4be8-b916-13c5816b1869" />
                    <div style="text-align: left">
                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word">
                        
                        Congratulations, Your Password has been reset. You can now log in.
                        </p>
                       <div style="display: flex; justify-content: center; align-items: center;"> <button style="border-radius: 22.566px; background: var(--primary-color-violet, #8000FF); width: 258px; height: 39.114px; color: white; border: 1px solid var(--primary-color-violet, #8000FF); cursor: pointer">Get Started</button> </div> <!-- Get started button -->
                    </div>
            </td>
        </tr>
    </tbody>
</table> `;
  }
  if (type === "signup") {
    emailContent = `<table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #FBF8FF;" width="600">
    <tbody>
        <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
                <h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif;  text-decoration: none; color: #2E2E2E; text-align: left">Welcome <span style='font-weight: 600'>${title},</span> Let’s get started</h1>
                <div style="padding: 10px; background: white; font-family: Poppins;"> <img style="width: 140px; height: 94px;" src="https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/mailOpen.png?alt=media&token=26751789-ee5a-4b51-98fb-8525c29a35f7" />
                    <div style="text-align: left">

                    <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word"> 
                    Dear ${title}, Thank you for signing up with Trades Trek. We’re excited to have you on board. </p>
                       

                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word">Thank you for signing up with Trades Trek. We’re excited to have you on board. <br /> With TradesTrek, it’s so easy to learn how to trade so you can be the best at trading. <br /> Just before you begin, Visit your <a target="_blank" style="text-decoration: underline; color: #8C1AFF;" href="https://trades-trek-client.vercel.app/dashboard/learning"> learning page </a> to intimate yourself with the basics </p>
                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word"> Thanks for choosing TradesTrek, and welcome! <br /> Regards, <br /> TradesTrek </p>
                         <!-- Get started button -->
                        <div class=''>
                         <button style="border-radius: 22.566px; background: var(--primary-color-violet, #8000FF); width: 258px; height: 39.114px; color: white; border: 1px solid var(--primary-color-violet, #8000FF); cursor: pointer">Get Started</button> </div> <!-- Get started button -->
                        </div>
            </td>
        </tr>
    </tbody>
    </table>`;
  }

  if (type === "verification-signup") {
    const { code } = emailDetails;
    emailContent = `  <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #FBF8FF;" width="600">
    <tbody>
        <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
                <h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif;  text-decoration: none; color: #2E2E2E; text-align: left">Hi <span style='font-weight: 600'>${title},</span> </h1>
                <div style="padding: 10px; background: white; font-family: Poppins;"> <img style="" src="https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/walkingIllustration.png?alt=media&token=ada819cd-2d92-4be8-b916-13c5816b1869" />
                    <div style="text-align: left">
                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word">Thank you for signing up with us! To complete your registration, please <br /> verify your  email address by using the following code:<br>
                        
                         Verification code: <b> ${code} </b>
                        
                        <br/>Please enter this code in the verification field to confirm your email address. Code will be valid for 15 minutes 
                        
                        <br/>If you didn't request this verification code, please ignore this email.
                        
                        <br/>Please contact our customer support team if you have any questions or need further assistance 
                        
                        </p>
                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word">Best Regards, <br /> TradesTrek </p> <!-- Get started button -->
                        <div style="display: flex; justify-content: center; align-items: center;"> <button style="border-radius: 22.566px; background: var(--primary-color-violet, #8000FF); width: 258px; height: 39.114px; color: white; border: 1px solid var(--primary-color-violet, #8000FF); cursor: pointer">Get Started</button> </div> <!-- Get started button -->
                    </div>
            </td>
        </tr>
    </tbody>
</table>`;
  }

  if (type === "password-reset") {
    const { code, title } = emailDetails;
    emailContent = `
    <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #FBF8FF;" width="600">
    <tbody>
        <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
                <h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif;  text-decoration: none; color: #2E2E2E; text-align: left">Hello<span style='font-weight: 600'> ${title}</span> </h1>
                <div style="padding: 10px; background: white; font-family: Poppins;"> <img style="" src="https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/walkingIllustration.png?alt=media&token=ada819cd-2d92-4be8-b916-13c5816b1869" />
                    <div style="text-align: left">
                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word">We have received your password change request for your Trades Trek account.<br>
                        
                         Verification code: <b> ${code} </b>
                        
                        <br/>Please enter this code to change your password.
 
                        <br/>If you didn't request this verification code, please ignore this email.
                        
                        <br/>Please contact our customer support team if you have any questions or need further assistance 
                        
                        </p>
                        <p style="color: #2E2E2E; font-size: 14px; font-family: Poppins; font-weight: 500; word-wrap: break-word">Best Regards, <br /> TradesTrek </p> <!-- Get started button -->
                        <div style="display: flex; justify-content: center; align-items: center;"> <button style="border-radius: 22.566px; background: var(--primary-color-violet, #8000FF); width: 258px; height: 39.114px; color: white; border: 1px solid var(--primary-color-violet, #8000FF); cursor: pointer">Get Started</button> </div> <!-- Get started button -->
                    </div>
            </td>
        </tr>
    </tbody>
</table> 
    `;
  }

  return `
  <!DOCTYPE html>
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
  
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
      <title>TradesTrek</title> 
      <style type="text/css">
          
         .getStartedDiv{
          display: 'flex';
          justify-content: center;
          align-items: center;
         }
          a,
          a[href],
          a:hover,
          a:link,
          a:visited {
            /* This is the link colour */
            text-decoration: none !important;
            color: #0000EE;
          }
          
          .link {
            text-decoration: underline !important;
          }
          
          p,
          p:visited {
            /* Fallback paragraph style */
            font-size: 15px;
            line-height: 24px;
            font-family: 'Helvetica', Arial, sans-serif;
            font-weight: 300;
            text-decoration: none;
            color: #000000;
          }
          
          h1 {
            /* Fallback heading style */
            font-size: 22px;
            line-height: 24px;
            font-family: 'Helvetica', Arial, sans-serif;
            font-weight: normal;
            text-decoration: none;
            color: #000000;
          }
          
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td {
            line-height: 100%;
          }
          
          .ExternalClass {
            width: 100%;
          }
      </style> <!-- End stylesheet -->
  </head> <!-- You can change background colour here -->
  
  <body style="text-align: center; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%;background-color: #FFFF; color: #000000" align="center">
      <!-- Fallback force center content -->
      <div style="text-align: center;">
          <!-- Email not displaying correctly -->
          <!-- Hero image --> <img style="width: 600px; max-width: 600px; height: 350px; max-height: 350px; text-align: center;" alt="Hero image" src="https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/Screenshot%202023-07-06%20at%2008.52.24.png?alt=media&token=61e9c1bc-6d10-4562-ab50-30679f22b871" align="center" width="600" height="350"> <!-- Hero image -->
          <!-- Start single column section -->
           ${emailContent}
          <!-- App store  section -->
          <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #FBF8FF;" width="600">
              <tbody>
                  <tr>
                      <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
                          <div style="padding: 40px; background: white; font-family: Poppins;">
                              <div style="text-align: center">
                                  <div style="color: #2E2E2E; font-size: 20px; font-family: Poppins; font-weight: 500; word-wrap: break-word">Get the Trade Trek app </div>
                                  <p>Get the most of Trade Trek by installing the <br /> mobile app.</p> <!-- Aple - Google section -->
                                  <div style="width: 389px; height: 54px; justify-content: flex-start; align-items: flex-start; gap: 45px; display: inline-flex">
                                      <div style="width: 172px; height: 54px; position: relative">
                                          
                                          <div style="width: 172px; height: 54px; left: 0px; top: 0px; position: absolute; background: black; border-radius: 4px"></div>
                                          <div style="left: 58px; top: 8px; position: absolute; text-align: center; color: white; font-size: 12px; font-family: Poppins; font-weight: 400; word-wrap: break-word">Available on the</div>
                                          
                                          
                                          
                                          
                                             
                                              
                                        
                                          
                                          <div style="width: 24px; height: 24px; left: 16px; top: 11px; position: absolute; ">
                                              
                                               <img  src="  https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/Apple.png?alt=media&token=42fbd492-7de6-4bd2-8024-09967f608f2b" />
                                          </div>
                                          
                                          
                                          
                                          
                                          
                                          <div style="left: 54px; top: 25px; position: absolute; text-align: center; color: white; font-size: 16px; font-family: Poppins; font-weight: 400; word-wrap: break-word">Apple Store</div>
                                      </div>
                                      <div style="width: 172px; height: 54px; position: relative">
                                          <div style="width: 172px; height: 54px; left: 0px; top: 0px; position: absolute; background: black; border-radius: 4px"></div>
                                          <div style="left: 58px; top: 8px; position: absolute; text-align: center; color: white; font-size: 12px; font-family: Poppins; font-weight: 400; word-wrap: break-word">Available on the</div>
                                          <div style="width: 30px; height: 30px; left: 14px; top: 12px; position: absolute;">
                                              
                                               <img  src="https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/PlayStore.png?alt=media&token=a7b1c635-6223-4147-8bca-604c77d52117" />
                                              
                                          </div>
                                          <div style="left: 58px; top: 25px; position: absolute; text-align: center; color: white; font-size: 16px; font-family: Poppins; font-weight: 400; word-wrap: break-word">Google Play</div>
                                      </div>
                                  </div> <!-- Aple - Google section -->
                              </div>
                      </td>
                  </tr>
                  <tr>
                      <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 30px;" width="596">
                          <div style="width: 358px; height: 0px; border: 0.50px #EDECEC solid; margin: 30px auto"></div>
                          
                           <img  style='margin-bottom: 40px' src=" https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/TradesTrek.png?alt=media&token=9ec36a76-f88e-4026-8200-354262dc7cd7" />
                          
                         
                          
                          <div style="color: #393939; font-size: 14px; font-family: Poppins; font-weight: 400; word-wrap: break-word">Copyright Ⓒ 2023, Trade Trek. All Right Reserved</div>
                      </td>
                  </tr>
              </tbody>
          </table> <!-- App store  section -->
      </div>
  </body>
  
  </html>`;
};

function sendTransacEmail({ to, subject, htmlContent }) {
  const apiURL = "https://console.sendlayer.com/api/v1/email";
  const apiKey = "118A4851-13623754-4782FEE6-ABC5B70A"; // Add your API key

  const data = {
    From: {
      name: "Nat surveys",
      email: "natsurveys@gmail.com",
    },
    To: [
      {
        email: to,
      },
    ],
    Subject: subject,
    ContentType: "HTML",
    HTMLContent: htmlContent,
    PlainContent: htmlContent,
    Headers: {
      "X-Mailer": "SendLayer API",
    },
  };

  axios
    .post(apiURL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
    .then((response) => {
      console.log("email sent");
    })

    .catch((error) => {
      console.log("inside api to send email", error);
    });
}

export const successfulSignupMessage = (emailDetails) => {
  sendTransacEmail({
    to: emailDetails.email,
    subject: "Welcome to Nat surveys",
    htmlContent: `
    <div style='height: 300px;
    width: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f1f3f4'>
    <p style='padding: 123px 20px;
    color: black;'
    >
    Thank you for signing up with Nat surveys. We’re excited to have you on board
    </p>
    
    </div>
   
            `,
  });
};

export const sendPasswordResetEmail = (emailDetails) => {
  sendTransacEmail({
    to: emailDetails.email,
    subject: "Reset your password",
    htmlContent: constructHTML(emailDetails),
  });
};

export const sendPasswordResetSuccessEmail = (emailDetails) => {
  sendTransacEmail({
    to: emailDetails.email,
    subject: "Password reset successful",
    htmlContent: constructHTML(emailDetails),
  });
};

export const SendEmail = (emailDetails) => {
  const { type, code, title, email } = emailDetails;
  sendTransacEmail({
    to: email,
    subject: "Verify your email",
    htmlContent:  `
    <div style='height: 300px;
    width: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f1f3f4'>
    <p style='padding: 123px 20px;
    color: black;'
    >
    Hello from, Nat surveys Your one-time-password(OTP) is ${code}, Kindly do not share it with someone.
    </p>
    
    </div>
   
            `,
  });
};
export const subscriptionRemainder = (email, date) => {
  sendTransacEmail({
    to: email,
    subject: "Subscription Remainder",
    htmlContent: `
        <div style='height: 300px;
        width: 550px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: #f1f3f4'>
        <p style='padding: 123px 20px;
        color: black;'
        >
        Hello from, Trades Trek! Your subscription is expired ${moment(
          date,
        ).format("lll")}.
        </p>
        
        </div>
       
                `,
  });
};

export const orderPlacedEmail = (user, order) => {
  sendTransacEmail({
    to: user.email,
    subject: "Order Placed",
    htmlContent: `
      <div style='height: 300px;
      width: 550px;
      text-align: center;
      background: #f1f3f4'>
      <h1>Order Placed Successfully.</h1><br>
     
      <p>Dear ${user.firstName}  ${user.lastName},</p>
      <p>We are pleased to inform you that your recent order has been successfully placed on our platform. Thank you for choosing TradesTrek for your stock trading needs. </p><br>
      <p>Here are the details  of your order</p>
      <p>Stock: ${order.symbol}</p><br>
    
      <p>Order Type: ${order.orderType}</p><br>
      <p> Order Quantity: ${order.quantity}</p><br>
  
      <p>Time placed :${TimeConverter(order.createdAt)}</p><br>

      <p>
      Please review these details carefully to ensure that they match your desired trade. If you notice any discrepancies or have any questions, please contact our customer support team immediately.
      </p> <br>

      <p>Thank you again for choosing Trades Trek for your stock trading needs. We look forward to serving you in the future.</p>

   
      <p>Best regards,</p><br>
       Trades Trek
      </div>
     
              `,
  });
};
export const orderFailledEmail = (user, order, message) => {
  sendTransacEmail({
    to: user.email,
    subject: "Order Canceled",
    htmlContent: `
      <div style='height: 300px;
      width: 550px;
     
      text-align: center;
      background: #f1f3f4'>
      <h1>Order Cancelled</h1><br>

      <p>Dear ${user.firstName}  ${user.lastName},</p>
     
      <p>Your Order with Trades Trek has been canceled. </p>
      <p>Reason:  ${message}</p>

      <br>

      <p >Order Summary</p>
     
      <p> Trade: ${order.symbol}</p><br>
    
      <p>Trade Type: ${order.orderType}</p><br>

      <p>Volume: ${order.quantity}</p><br>

      <p>Time Cancelled :${moment(new Date()).format("lll")}</p><br>
   
      </div>
     
              `,
  });
};
export const orderExecuteEmail = (user, order) => {
  sendTransacEmail({
    to: user.email,
    subject: "Order Successful",
    htmlContent: `
      <div style='height: 300px;
      width: 550px;
     
      text-align: center;
      background: #f1f3f4'>
      <h1>Confirmation of Your Stock Order</h1><br>
     
      <p>Dear ${user.firstName}  ${user.lastName},</p>

      <p>We are pleased to inform you that your order to ${order.action} ${
        order.quantity
      } shares of ${order.symbol} at ${
        order.rate
      } has been executed successfully  at ${moment(new Date()).format(
        "lll",
      )}</p><br>
      

      <p>The transaction has been completed, and the ${
        order.quantity
      } shares have been added/subtracted from your account. You can check your updated portfolio by logging into your account.</p>
  
   <br>
   <p>If you have any questions or concerns regarding this transaction, please do not hesitate to contact our customer support team </p>

   <br>
   <p>Thank you for choosing Trades Trek for your investment needs.
   </p>
      </div>
     
              `,
  });
};
export const TradeOpen = (email) => {
  sendTransacEmail({
    to: email,
    subject: "Trade Opened",
    htmlContent: `
        <div style='height: 300px;
        width: 550px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: #f1f3f4'>
        <h1>Trade Opened</h1><br>
        <p>${email[0].email}</p><br>
        <p>We've received the following trade order on the Trades Trek Stock simulator: </p><br>
        <p>Symbol: BABA</p><br>
        <p>Security Type: Stock</p><br>
        <p>Trade Type: Buy Market</p><br>
        <p>Volume: 20</p><br>
        <p>Time placed : 8/5/2022 12:51:27 PM EST</p><br>
        <p>Order Id: 989786</p><br>
        <p>You will receive another email once the oreder is complete</p><br>
        </div>
       
                `,
  });
};
export const SubscriptionSuccess = (email, duration, expireDate) => {
  sendTransacEmail({
    to: email,
    subject: "Subscribe Successfull",
    htmlContent: `
      <div style='height: 300px;
      width: 550px;
     
      text-align: center;
      background: #f1f3f4'>
      <h1>${duration} package subscribed</h1><br>
  
      <p>You can use all functionality.</p><br>
   
      <p>Subscription Expired Date ${moment(expireDate).format("lll")}</p><br>
      </div>
     
              `,
  });
};

export const UnsubscribeSubscription = (email, duration, expireDate) => {
  sendTransacEmail({
    to: email,
    subject: "Subscribe Cancelled",
    htmlContent: `
      <div style='height: 300px;
      width: 550px;
     
      text-align: center;
      background: #f1f3f4'>
      <h1>${duration} package subscription is cancelled</h1><br>
  
      <p>Your subsciption is cancelled.</p><br>
   
 
     
              `,
  });
};

export const InviteToPrivateGameEmail = (emailDetails) => {
  const { email, competitionName, user, password, url } = emailDetails;
  sendTransacEmail({
    to: email,
    subject: "Join a private competition",
    htmlContent: `
    <div style='height: 300px;
    width: 550px;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f1f3f4'>
    <h1>Join a private competition</h1>

    <p> Hello, </p>
    <p>You have been invited by ${user.fistName} ${user.lastName} to join a Competition: ${competitionName} </p><br>
    <p> Click <a href=${url}>here</a> to Join the competition</p>
    <p>Password:- ${password}</p>
    </div>
   
                `,
  });
};

export const InviteToGameEmail = (emailDetails) => {
  const { email, competitionName, url, user } = emailDetails;
  sendTransacEmail({
    to: email,
    subject: "Join a competition",
    htmlContent: `
        <div style='height: 300px;
        width: 550px;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: #f1f3f4'>
        <h1>Join a competition</h1>

        <p> Hello, </p>
        <p>You have been invited by ${user.fistName} ${user.lastName} to join a Competition: ${competitionName} </p><br>
        <p> Click <a href=${url}>here</a> to Join the competition </p>
        
        </div>
       
                `,
  });
};

export const InviteFriends = (email, user) => {
  sendTransacEmail({
    to: email,
    subject: "Join us on Trades Trek",
    htmlContent: constructHTML({ email, user, type: "referral" }),
  });
};
export const HelpAndSupport = (user, title) => {
  sendTransacEmail({
    to: user.email,
    subject: title,
    htmlContent: `
      <div>
    <span>Hey ${user.firstName}</span>
    <p>We appreciate you for bringing this to our attention!.</p>

    <p>
    We will escalate this issue to the right team.
    </p>
     <p>
     Looking forward to serving you better and making your experience more than amazing.

 
     </p>
    <span>Best regards,</span> <br>
    <span>Trades Trek</span>

     </div>
     
              `,
  });
};
export const HelpAndSupportAdmin = (email, data) => {
  sendTransacEmail({
    to: email,
    subject: data.title,
    htmlContent: `
      <div >

    <p>${data.title}</p>
     <p>${data.description}</p>
   
     </div>
     
              `,
  });
};

export const SendReviewToAdmin = (body, user) => {
  sendTransacEmail({
    to: 'contactus@tradestrek.com',
    subject: body.title,
    htmlContent: body.url
      ? `
      <div>
      <p> <b>Name:</b>  ${user.firstName} ${user.lastName} </p>
      <p><b>UserName:</b> ${user.username}</p>
      <p><b>Email:</b> ${user.email}</p>
     <p>${body.description}</p>
      <img src=${body.url} />
     </div>`
      : `
     <div>
     <p> <b>Name:</b>  ${user.firstName} ${user.lastName} </p>
     <p><b>UserName:</b> ${user.username}</p>
     <p><b>Email:</b> ${user.email}</p>
    <p>${body.description}</p>
    </div>`,
  });
};

// export default SendEmail;
