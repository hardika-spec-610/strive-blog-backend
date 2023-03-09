import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendsEmailWhenCreateNewBlogPost = async (recipientAdress) => {
  const msg = {
    to: recipientAdress,
    from: { name: "Hardika Moradiya", email: process.env.SENDER_EMAIL_ADDRESS },
    subject: "New posted blog",
    text: "bla bla bla",
    html: "<strong>bla bla bla but in bold</strong>",
  };
  await sgMail.send(msg);
};
