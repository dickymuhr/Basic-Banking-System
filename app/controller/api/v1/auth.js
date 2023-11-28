const prisma = require('../../../prismaClient');
const { encryptPassword, checkPassword } = require('../../../../utils/auth')
const { JWTsign } = require('../../../../utils/jwt')
const { sendMailHTML } = require('../../../../utils/mailer');
const ejs = require('ejs');
const path = require('path');

module.exports = {
    async register(req, res){
        try {
            const { name, email, password, identity_type, identity_number, address } = req.body;
            const user = await prisma.users.findFirst({
                where: { email }
            })
    
            if(user){
                return res.status(404).json({
                    status: "Fail!",
                    message: "Email already registered!"
                })
            }
    
            const createUser = await prisma.users.create({
                data: {
                    name: name,
                    email: email,
                    password: await encryptPassword(password),
                    profile: {
                        create: {
                            identity_type: identity_type,
                            identity_number: identity_number,
                            address: address,
                        }
                    }
                }
            });

            // Load and compile EJS template
            const emailTemplatePath = path.join(__dirname, '../../../../templates/email-register.ejs');
            const html = await ejs.renderFile(emailTemplatePath, { name: name, email: email });
            // Send registration email
            sendMailHTML(email, 'Registration Successful', html);
    
            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'Register Success!',
                data: createUser
            });
    
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async login(req, res){
        const {email, password} = req.body;
        const user = await prisma.users.findFirst({
            where: { email }
        })
        if(!user){
            return res.status(404).json({
                status: "Fail!",
                message: "User not found!"
            })
        }
        const isPasswordCorrect = await checkPassword(
            password, user.password
        )
        if(!isPasswordCorrect){
            return res.status(401).json({
                status: "Fail!",
                message: "Wrong password!"
            })
        }
        delete user.password
        const token = await JWTsign(user)
        return res.status(201).json({
            status: "Success!",
            message: "Login Success!",
            data: { user, token } 
        })
    },

    async authenticate(req, res){
        return res.status(200).json({
            status: "Success!",
            message: "Authentication Success!",
            data: {
                user: req.user
            }
        })
    },
}