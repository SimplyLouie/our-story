/**
 * Email service using mailto: links to open iCloud Mail (or default email client)
 * This approach doesn't require API keys or backend services
 */

import { RSVP, RSVPStatus } from '../types';

export class EmailService {
    /**
     * Generate mailto link for RSVP confirmation email
     */
    static getRSVPConfirmationMailto(rsvp: RSVP): string {
        const subject = encodeURIComponent('RSVP Confirmation - Louie & Florie Wedding');

        const statusText = rsvp.status === RSVPStatus.ATTENDING ? 'Yes' :
            rsvp.status === RSVPStatus.NOT_ATTENDING ? 'No' : 'Maybe';

        const body = encodeURIComponent(
            `Dear ${rsvp.name},\n\n` +
            `Thank you for your RSVP!\n\n` +
            `**Your RSVP Details:**\n` +
            `Name: ${rsvp.name}\n` +
            `Email: ${rsvp.email || 'Not provided'}\n` +
            `Attending: ${statusText}\n` +
            `${rsvp.plusOne ? `Plus One: ${rsvp.plusOneName || 'Yes'}\n` : ''}\n` +
            `${rsvp.dietary ? `Dietary Restrictions: ${rsvp.dietary}\n` : ''}\n` +
            `${rsvp.notes ? `Message: ${rsvp.notes}\n` : ''}\n\n` +
            `We look forward to celebrating with you on July 4, 2026!\n\n` +
            `**Event Details:**\n` +
            `Date: July 4, 2026\n` +
            `Time: TBD\n` +
            `Venue: TBD\n\n` +
            `For any questions or changes, please reply to this email.\n\n` +
            `With love,\n` +
            `Louie & Florie`
        );

        return `mailto:${rsvp.email}?subject=${subject}&body=${body}`;
    }

    /**
     * Generate mailto link for follow-up reminder
     */
    static getFollowUpReminderMailto(rsvp: RSVP): string {
        const subject = encodeURIComponent('Friendly Reminder - Louie & Florie Wedding RSVP');
        const body = encodeURIComponent(
            `Dear ${rsvp.name},\n\n` +
            `We hope this email finds you well!\n\n` +
            `We noticed you haven't confirmed your attendance for our wedding yet. ` +
            `We'd love to have you celebrate with us on July 4, 2026.\n\n` +
            `Please let us know if you'll be able to join us by visiting our wedding website:\n` +
            `[Your Website URL]\n\n` +
            `If you have any questions or need more information, feel free to reach out!\n\n` +
            `Looking forward to hearing from you.\n\n` +
            `Warmest regards,\n` +
            `Louie & Florie`
        );

        return `mailto:${rsvp.email}?subject=${subject}&body=${body}`;
    }

    /**
     * Generate mailto link for batch reminders (opens with BCC)
     */
    static getBatchReminderMailto(rsvps: RSVP[]): string {
        const emails = rsvps.map(r => r.email).join(',');
        const subject = encodeURIComponent('Friendly Reminder - Louie & Florie Wedding RSVP');
        const body = encodeURIComponent(
            `Dear Friends and Family,\n\n` +
            `We hope this email finds you well!\n\n` +
            `We're reaching out to remind you about our upcoming wedding on July 4, 2026. ` +
            `If you haven't already, please RSVP through our wedding website at your earliest convenience.\n\n` +
            `We can't wait to celebrate this special day with you!\n\n` +
            `If you need any additional information, please don't hesitate to reach out.\n\n` +
            `With love,\n` +
            `Louie & Florie`
        );

        return `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
    }

    /**
     * Open confirmation email in default mail client
     */
    static sendRSVPConfirmation(rsvp: RSVP): void {
        const mailtoLink = this.getRSVPConfirmationMailto(rsvp);
        window.open(mailtoLink, '_blank');
    }

    /**
     * Open follow-up reminder in default mail client
     */
    static sendFollowUpReminder(rsvp: RSVP): void {
        const mailtoLink = this.getFollowUpReminderMailto(rsvp);
        window.open(mailtoLink, '_blank');
    }

    /**
     * Open batch reminder email in default mail client
     */
    static sendBatchReminders(rsvps: RSVP[]): void {
        const mailtoLink = this.getBatchReminderMailto(rsvps);
        window.open(mailtoLink, '_blank');
    }
}

export default EmailService;
