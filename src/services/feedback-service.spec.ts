import { FeedbackService } from './feedback-service';

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();


const submitFeedback = new FeedbackService(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
)

describe('Submit Feedback', () => {
    it('should be able to submit a feedback', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
            screenshot: 'data:image/png;base64:qualquercoisa'
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
        
    })

    it('should not be able to submit a feedback without type', async () => {
        await expect(submitFeedback.execute({
            type: '',
            comment: 'example comment',
            screenshot: 'data:image/png;base64:qualquercoisa'
        })).rejects.toThrow();
    })

    it('should not be able to submit a feedback without comment', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: '',
            screenshot: 'data:image/png;base64:qualquercoisa'
        })).rejects.toThrow();
    })


    it('should not be able to submit a feedback with invalid screenshot', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'Example Comment',
            screenshot: 'qualquercoisa'
        })).rejects.toThrow();
    })
})