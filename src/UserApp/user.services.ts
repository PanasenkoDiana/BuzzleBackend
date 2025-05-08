import { CreateUser, IError, ISuccess, User } from "./user.types";
import { UserRepositories } from "./user.repositories";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { SECRET_KEY } from "../config/token";
import { EmailService } from "../core/email.service";
import { VerificationService } from "../core/verification.service";

const verificationService = new VerificationService(EmailService);

export const UserService = {
    createUser: async function(data: CreateUser): Promise<IError | ISuccess<string>> {
        const existingUserByUsername = await UserRepositories.findUserByEmail(data.email);
        if (existingUserByUsername) {
            return { status: 'error', message: 'User with this username already exists'};
        }

        const existingUserByEmail = await UserRepositories.findUserByEmail(data.email);
        if (existingUserByEmail) {
            return { status: 'error', message: 'User with this email already exists'};
        }

        const emailSent = await verificationService.generateAndSendCode(data.email, data);
        if (!emailSent) {
            return { status: 'error', message: 'Failed to send verification email' };
        }

        return { status: 'success', data: 'Verification code sent' };
    },

    verifyUser: async function(email: string, code: string): Promise<IError | ISuccess<string>> {
        const userData = await verificationService.verifyCode(email, code);
        if (!userData) {
            return { status: 'error', message: 'Invalid or expired verification code' };
        }

        const hashedPassword = await hash(userData.password, 10);
        const newUser = await UserRepositories.createUser({ ...userData, password: hashedPassword });
        if (!newUser) {
            return { status: 'error', message: 'Failed to create user' };
        }

        const token = sign({ id: newUser.id }, SECRET_KEY, { expiresIn: '1d' });
        return { status: 'success', data: token };
    },

    authUser: async function(email: string, password: string): Promise<IError | ISuccess<string>> {
        const user = await UserRepositories.findUserByEmail(email);
        if (!user) {
            return { status: 'error', message: 'User not found' };
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return { status: 'error', message: 'Incorrect password' };
        }

        const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
        return { status: 'success', data: token };
    },

    getUserByid: async function(id: number): Promise<IError | ISuccess<User>> {
        const user = await UserRepositories.findUserById(id);
        if (!user) {
            return { status: 'error', message: 'User not found' };
        }
        
        return { status: 'success', data: user };
    }
};
