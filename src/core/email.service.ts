import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const EmailService = {
    sendVerifyMail: async function (email: string, code: string): Promise<boolean> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Код подтверждения',
            text: `Ваш код подтверждения: ${code}`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Письмо отправлено:', info.response);
            return true;
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            return false;
        }
    },

    generateCode: function(length: number) {
        return crypto.randomBytes(length)
            .toString('base64')
            .replace(/[^A-Z0-9]/gi, '')
            .slice(0, length)
            .toUpperCase();
    }
};
