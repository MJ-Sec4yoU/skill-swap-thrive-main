const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
});

// File type validation
const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
]);

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${Array.from(allowedMimeTypes).join(', ')}`), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter: fileFilter
});

// Helper function to clean up old avatar
const cleanupOldAvatar = async (filename) => {
    if (!filename) return;
    
    try {
        const filepath = path.join(uploadDir, filename);
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
            console.log(`Cleaned up old avatar: ${filename}`);
        }
    } catch (error) {
        console.error(`Error cleaning up old avatar: ${error.message}`);
    }
};

// Error handler middleware for upload errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: true,
                code: 'FILE_TOO_LARGE',
                message: 'File size exceeds 5MB limit'
            });
        }
        return res.status(400).json({
            error: true,
            code: err.code,
            message: err.message
        });
    }
    
    if (err.message.includes('Invalid file type')) {
        return res.status(400).json({
            error: true,
            code: 'INVALID_FILE_TYPE',
            message: err.message
        });
    }
    
    next(err);
};

module.exports = {
    upload,
    cleanupOldAvatar,
    handleUploadError,
    allowedMimeTypes
};