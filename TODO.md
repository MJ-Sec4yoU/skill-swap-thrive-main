# Avatar Upload Fix Plan

## Information Gathered
- Avatar uploaded via FormData in EditProfile.tsx, saved by multer in 'uploads/' directory with unique filename (e.g., "avatar-1234567890.jpg").
- Filename stored in user.profile.avatar.
- Backend GET /profile prefixes avatar path with 'uploads/' if not already.
- Frontend buildAssetUrl builds full URL: "http://localhost:5000/uploads/filename?t=..."
- Server serves static files from 'uploads' at '/uploads' with CORS headers.
- Dashboard displays avatar using buildAssetUrl with cache busting.

## Plan
- [x] Add logging in backend profile update route to confirm file upload and filename save.
- [x] Ensure uploads directory exists and is writable. (Exists)
- [x] Add error handling in Dashboard avatar img with onError fallback to default avatar.
- [x] Verify static file serving in server.js (appears correct).
- [ ] Test avatar upload flow by starting servers and uploading an avatar.

## Dependent Files to be edited
- backend/routes/users.js: Add logging for avatar upload confirmation.
- src/pages/Dashboard.tsx: Add onError handler for avatar img element.

## Followup steps
- [ ] Start backend server (npm start in backend).
- [ ] Start frontend (npm run dev in root).
- [ ] Test avatar upload in EditProfile page.
- [ ] Check backend logs for upload confirmation.
- [ ] Verify uploaded file exists in backend/uploads/.
- [ ] Confirm avatar displays correctly in Dashboard.
- [ ] Debug any remaining issues (e.g., URL mismatch, CORS).
