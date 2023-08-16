import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './Email.css';

const Email = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = {
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(payload.email)) {
            setErrorMessage('Invalid email address.');
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
            return;
        }

        try {
            setIsSending(true);
            const response = await fetch('http://localhost:3002/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccessMessage('Email sent successfully!');
                setErrorMessage('');
                setShowSuccessAlert(true);
                setShowErrorAlert(false);
                setIsSending(false);
                e.target.reset();
            } else {
                setErrorMessage('An error occurred while sending the email.');
                setSuccessMessage('');
                setShowSuccessAlert(false);
                setShowErrorAlert(true);
                setIsSending(false);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setErrorMessage('An error occurred while sending the email.');
            setSuccessMessage('');
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
            setIsSending(false);
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="container">
                <div className="section-title" data-aos="fade-up">
                    <h2>Email With React And Azure mail service!!</h2>
                </div>

                <div className="row mt-5 justify-content-center">
                    <div className="col-lg-10">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 form-group mt-3 mt-md-0">
                                    <input type="email" name="email" className="form-control" id="email" placeholder="Your Email" required />
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <input type="text" name="subject" className="form-control" id="subject" placeholder="Subject" required />
                            </div>
                            <div className="form-group mt-3">
                                <textarea className="form-control" rows="5" name="message" placeholder="Message" id="message" required></textarea>
                            </div>
                            <div className="my-3">
                                {showSuccessAlert && (
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
                                            {successMessage}
                                        </Alert>
                                    </Stack>
                                )}
                                {showErrorAlert && (
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Alert severity="error" onClose={() => setShowErrorAlert(false)}>
                                            {errorMessage}
                                        </Alert>
                                    </Stack>
                                )}
                            </div>
                            <div className="text-center"><button type="submit">{isSending ? 'Sending...' : 'Send'}</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Email;
