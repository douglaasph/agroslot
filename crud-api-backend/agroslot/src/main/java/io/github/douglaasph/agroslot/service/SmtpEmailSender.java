package io.github.douglaasph.agroslot.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class SmtpEmailSender {
    private static final Logger log = LoggerFactory.getLogger(SmtpEmailSender.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String from;

    public SmtpEmailSender(JavaMailSender mailSender,
                           TemplateEngine templateEngine,
                           @Value("${app.mail.from}") String from) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.from = from;
    }

    @Async("emailExecutor")
    public void sendPasswordReset(String recipient, String name, String link) {
        Context ctx = new Context();
        ctx.setVariable("nome", name);
        ctx.setVariable("link", link);
        send(recipient, "Redefinição de senha", "email/recover-password", ctx);
    }

    @Async("emailExecutor")
    public void sendWelcome(String recipient, String name) {
        Context ctx = new Context();
        ctx.setVariable("nome", name);
        send(recipient, "Bem-vindo(a) ao AgroSlot", "email/welcome", ctx);
    }

    private void send(String recipient, String subject, String template, Context ctx) {
        try {
            String html = templateEngine.process(template, ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Email '{}' enviado", subject);
        } catch (Exception e) {
            log.error("Falha ao enviar email '{}'", subject, e);
        }
    }
}