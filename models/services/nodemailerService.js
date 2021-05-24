const nodemailer = require("nodemailer");


exports.configEmailToSend = async (account, OTP) => {
    const smtpTransport = nodemailer.createTransport('smtps://hcmus.hexad%40gmail.com:18212227@smtp.gmail.com');
    const mail = {
        from: "From@gmail.com",
        to: account.email,
        subject: "MÃ XÁC NHẬN",
        html: "<b>Mã xác nhận của bạn là: </b>" + OTP
    }
    return {smtpTransport,mail};
}