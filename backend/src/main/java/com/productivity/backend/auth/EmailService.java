package com.productivity.backend.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

     @Value("${spring.mail.username}")
    private String smtpUser;


    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);

        message.setTo(email);

        message.setSubject("Reset Password HeyJipro");

        message.setText(
                "Halo,\n\n" +
                "Kode OTP untuk reset password akun HeyJipro Anda adalah :\n\n" +
                otp +
                "\n\n" +
                "Kode ini hanya berlaku selama 5 menit.\n\n" +
                "Jangan berikan kode ini kepada siapa pun."
        );

        

System.out.println("SMTP USER = " + smtpUser);
System.out.println("FROM = " + from);
System.out.println("TO = " + email);

        mailSender.send(message);

    }

}