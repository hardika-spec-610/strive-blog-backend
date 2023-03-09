import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendsEmailWhenCreateNewBlogPost = async (recipientAdress) => {
  const msg = {
    to: recipientAdress,
    from: { name: "Hardika Moradiya", email: process.env.SENDER_EMAIL_ADDRESS },
    subject: "New posted blog",
    text: "Hi, a new blog post has been created.",
    html: "<p>Hi, a new blog post has been created.</p>",
    // attachments:[
    //     {
    //         content:attachments,
    //         filename:"newBlogPost.pdf",
    //         type:"application/pdf",
    //         disposition:"attachment"
    //     }
    // ]
  };
  await sgMail.send(msg);
};
