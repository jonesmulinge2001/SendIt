/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { EmailStatus, PrismaClient } from 'generated/prisma';

export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
}

export interface WelcomeEmailContext {
  username: string;
  email: string;
  appName?: string;
  supportEmail?: string;
  loginUrl?: string;
}

@Injectable()
export class SendItMailerService {
  private prisma = new PrismaClient();
  private readonly logger = new Logger(SendItMailerService.name);
  private transporter: nodemailer.Transporter;
  private templatesPath: string;

  constructor(private configService: ConfigService) {
    this.templatesPath = path.join(process.cwd(), 'src', 'templates');
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const smtpConfig = {
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
    this.logger.log('SendIt Email transporter initialized');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      let html = options.html;

      if (options.template && options.context) {
        html = await this.renderTemplate(options.template, options.context);
      }

      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'sendit@example.com'),
        to: options.to,
        subject: options.subject,
        html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${options.to} (ID: ${result.messageId})`);

      // ✅ Log email in database
      await this.prisma.emailNotification.create({
        data: {
          toEmail: options.to,
          subject: options.subject,
          body: html ?? options.text ?? '',
          type: options.template || 'custom',
          parcelId:
            options.context && 'parcelId' in options.context
              ? options.context.parcelId
              : null,
          sentAt: new Date(),
          status: EmailStatus.SENT,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error sending email to ${options.to}: ${error.message}`,
      );
    }
  }

  async sendWelcomeEmail(
    to: string,
    context: WelcomeEmailContext,
  ): Promise<void> {
    const emailOptions: EmailOptions = {
      to,
      subject: `Welcome to SendIt Courier Service`,
      template: 'email/welcome',
      context: {
        ...context,
        name: context.username,
        appName: context.appName || 'SendIt',
        loginUrl:
          context.loginUrl ||
          `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200/login')}`,
        supportEmail:
          context.supportEmail ||
          this.configService.get<string>('SUPPORT_EMAIL', 'support@sendit.com'),
        currentYear: new Date().getFullYear(),
      },
    };

    await this.sendEmail(emailOptions);
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(
          `Template ${templateName} not found at ${templatePath}`,
        );
      }

      const templateOptions = {
        filename: templatePath,
        cache: process.env.NODE_ENV === 'production',
        compileDebug: process.env.NODE_ENV !== 'production',
      };

      return await ejs.renderFile(templatePath, context, templateOptions);
    } catch (error) {
      this.logger.error(
        `Error rendering template ${templateName}: ${error.message}`,
      );
      throw error;
    }
  }
}
