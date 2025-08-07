import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { Users } from '@models/auth/users';

export class EmailSender {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmailConfirmationSignUp(user: Users): Promise<void> {
    const token: string = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `${process.env.COMPANY} - Confirme seu cadastro!`,
        html: `<h2>Olá ${user.name}!</h2>
        <p>Para confirmar seu cadastro na Atari, clique no link abaixo:</p><br>
        <h3><p><a href="${process.env.URL_FRONT}/redirect?token=${token}" target="_blank">Confirmar cadastro</a></p></h3><br>
        <p>Se você não solicitou este e-mail, por favor, ignore-o. Caso contrário, prossiga com a confirmação do seu e-mail</p>
        <p>Atenciosamente,</p>
        <p>A Equipe ${process.env.COMPANY}</p>
        `,
        text: `Olá ${user.name}, Para confirmar seu cadastro, clique no link abaixo:`,
      });
    } catch (error) {
      throw Error('Erro interno do servidor!');
    }
  }

  async sendEmailConfirmationResetPassword(user: Users): Promise<void> {
    const token: string = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `${process.env.COMPANY} - Recuperação de senha!`,
        html: `<h2>Olá ${user.name}!</h2>
        <p>Recebemos sua solicitação de recuperação de senha. Para criar uma nova senha, clique no link abaixo:</p><br>
        <h3><p><a href="${process.env.URL_FRONT}/new-password?token=${token}" target="_blank">Recuperar senha</a></p></h3><br>
        <p>Se você não solicitou a recuperação de senha, por favor, ignore este e-mail, por motivos de segurança.</p>
        <p>Tenha um ótimo dia!</p><br>
        <p>Atenciosamente,</p>
        <p>A Equipe ${process.env.COMPANY}</p>
        `,
        text: 'Olá, Para mudar sua senha, clique no link abaixo:',
      });
    } catch (error) {
      throw Error('Erro interno do servidor!');
    }
  }
}
