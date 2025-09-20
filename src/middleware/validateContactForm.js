import validator from 'validator';
export const validateContactForm = (req, res, next) => {
    const { name, email, message } = req.body;
    const errors = [];

    // Validate name
    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    } else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Validate email
    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!validator.isEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    // Validate message
    if (!message || message.trim().length === 0) {
        errors.push('Message is required');
    } else if (message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
};
