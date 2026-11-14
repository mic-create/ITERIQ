import { body, validationResult } from 'express-validator';

export const validateAttendanceSubmission = [
    body('courseCode').isString().notEmpty().withMessage('Course code is required.'),
    body('academicLevel').isString().notEmpty().withMessage('Academic level is required.'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required.'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required.'),
    body('accuracy').isFloat({ min: 0 }).withMessage('Valid GPS accuracy is required.'),
    body('timestamp').optional().isNumeric().withMessage('Timestamp must be numeric.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];