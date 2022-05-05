import { MailAdapter } from './../adapters/mail-adapter';
import { FeedbacksRepository } from './../repositories/feedbacks-repository';

interface FeedbackServiceRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class FeedbackService {
    constructor(
        private feedbacksRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter
    ) { }

    async execute(request: FeedbackServiceRequest) {
        const { type, comment, screenshot } = request;

        if(!type) {
            throw new Error('Type Required')
        }

        if(!comment) {
            throw new Error('Comment Required')
        }

        if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
            throw new Error('Invalid Screenshot Format')
        }

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot
        })

        await this.mailAdapter.sendMail({
            subject: 'Novo Feedback',
            body: [
                `<div style="font-family: sans serif; font-size: 16px; color: #111;">`,
                `<p>Tipo do feedback: ${type}<p>`,
                `<p>Comentário: ${comment}<p>`,
                `</div>`
            ].join('\n')
        })
    }
}