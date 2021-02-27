import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

interface EmailBodyVariables {
  name: string;
  title: string;
  description: string;
  user_id: string;
  link: string | undefined;
}

class SendEmailService {
  private client: Transporter;
  
  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, variables: EmailBodyVariables, path: string) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const parsedMailTemplate = handlebars.compile(templateFileContent);

    const finalHtml = parsedMailTemplate(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html: finalHtml,
      from: "NPS <noreply@nps.com.br>",
    });

    console.log('Message sent: ', message.messageId);
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendEmailService();
