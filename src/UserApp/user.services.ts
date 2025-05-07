import { CreateUser, IError, ISuccess, User } from "./user.types";
import { UserRepositories } from "./user.repositories"
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs"
import { SECRET_KEY } from "../config/token";
import { EmailService } from "../core/email.service";
import { VerificationService } from "../core/verification.service";
const verificationService = new VerificationService(EmailService);
export const UserService = {
    createUser: async function(data: CreateUser): Promise< IError | ISuccess<string> >{
        const user = await UserRepositories.findUserByEmail(data.email)
        if (user) {
            return {status: 'error', message: 'User exists'}
        }

        // const hashedPassword = await hash(data.password, 10)
        // const userData = {
        //     ...data,
        //     password: hashedPassword
        // }
        
        // const newUser = await UserRepositories.createUser(userData)
        // if (!newUser) {
        //     return {status: 'error', message: 'Create error'}
        // }
        
        // const token = sign({id: newUser.id}, SECRET_KEY, {expiresIn: '1d'})

        //const verifyCode = EmailService.generateCode(6)
        //const email = EmailService.sendVerifyMail(data.email, verifyCode)
        const emailSent = await verificationService.generateAndSendCode(data.email);
        if (!emailSent) {
            return {status: 'error', message: 'Email not sent'}
        }


    
        return {status: 'success', data: 'ok'}
    },
    verifyUser: async function(email: string, code: string): Promise< IError | ISuccess<string> >{
        const isCodeValid = await verificationService.verifyCode(email, code);
        if (!isCodeValid) {
            return {status: 'error', message: 'Invalid code'}
        }
        return {status: 'success', data: 'Succesful Verification'}

        // const user = await UserRepositories.findUserByEmail(email)
        // if (!user) {
        //     return {status: 'error', message: 'User not found'}
        // }

        const hashedPassword = await hash(user.password, 10)
        const userData = {
            ...user,
            password: hashedPassword
        }
        
        const newUser = await UserRepositories.createUser(userData)
        if (!newUser) {
            return {status: 'error', message: 'Create error'}
        }
        
        const token = sign({id: newUser.id}, SECRET_KEY, {expiresIn: '1d'})
        
        return {status: 'success', data: token}
    },

    findUserByEmail: async function(email: string, data: CreateUser) {
        const user = await UserRepositories.findUserByEmail(email)
        if (!user) {
            return {status: 'error', message: 'User find error'}
        }
        return {status: 'success', data: user}
    },
    
    authUser: async function(email: string, password: string): Promise< IError | ISuccess<string> >{
        let user = await UserRepositories.findUserByEmail(email);

        if (!user){
            return {status: 'error', message: 'User not found'};
        }

        const isMatch = await compare(password, user.password)

        if (!isMatch){
            return {status: 'error', message: 'Wrong password'};
        }

        const token = sign({id: user.id}, SECRET_KEY, {expiresIn: '1d'})

        return {status: 'success', data: token};

    },
    getUserByid: async function(id: number): Promise< IError | ISuccess<User> >{
        const user = await UserRepositories.findUserById(id);

        if (!user) {
            return {status: 'error', message: "User is not found"}
        }

        return {status: 'success', data: user}
    },

    //verifyUser: async function(): Promise<IError | ISuccess<string>>{

        // const hashedPassword = await hash(data.password, 10)
        // const userData = {
        //     ...data,
        //     password: hashedPassword
        // }
        
        // const newUser = await UserRepositories.createUser(userData)
        // if (!newUser) {
        //     return {status: 'error', message: 'Create error'}
        // }
        
        // const token = sign({id: newUser.id}, SECRET_KEY, {expiresIn: '1d'})
        //return
   // }


}