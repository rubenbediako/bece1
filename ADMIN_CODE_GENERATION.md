# BECE 2026 - Automatic Code Generation for Admin

## Overview
The enhanced automatic code generation system now includes admin WhatsApp integration with **+233540456414** as the designated admin contact.

## Features

### 1. Generate for Admin (+233540456414)
- **Purpose**: Generates a new access code and sends it to both the user and the admin
- **Admin Notification**: Admin receives code details via WhatsApp at +233540456414
- **User Delivery**: User receives the code with instructions
- **Usage**: Perfect for when admin needs to manually distribute codes

### 2. Send Direct to User
- **Purpose**: Generates and sends code directly to the specified user
- **Process**: Creates new code → Sends to user → Notifies admin
- **Tracking**: All activities logged and admin notified

### 3. Send Current Code
- **Purpose**: Shares the existing active access code
- **Usage**: When multiple users need the same code
- **Admin Copy**: Admin can easily copy and share manually

## Admin WhatsApp Integration

### Admin Contact: +233540456414

### Notification Types:
1. **New Code Generated**: When codes are created for users
2. **Code Distribution**: When codes are sent to students
3. **System Activity**: Tracking and logging information

### Message Format (to Admin):
```
🤖 BECE 2026 - New Access Code Generated

🔑 Code: BECE1234
📱 For User: 0540456414
⏰ Generated: [timestamp]

✅ Share this code with the student

--
BECE 2026 Admin Notification
```

### Message Format (to User):
```
🎓 BECE 2026 Platform Access Code

Your new access code: BECE1234

Use this code to login to the BECE 2026 Prediction Platform.
⏰ Valid for 24 hours

📚 Start your BECE 2026 preparation now!

🆘 Need help? Reply to this message!
```

## How to Use

### For Admin Dashboard:
1. Login as admin (admin@bece.edu / admin123)
2. Navigate to Admin Dashboard
3. Scroll to "🤖 Automatic Code Generator & WhatsApp Sender" section
4. Enter user's phone number (e.g., 0540456414)
5. Choose appropriate action:
   - **Generate for Admin**: Get notified on WhatsApp + send to user
   - **Send Direct**: Send to user + admin notification
   - **Send Current**: Share existing code

### Phone Number Format:
- **Input**: 0540456414
- **Auto-formatted to**: +233540456414
- **Admin contact**: +233540456414

## Settings & Configuration

### Auto-Generation Toggle:
- Enable/disable automatic code generation
- Stored in browser localStorage
- Persists across sessions

### Default Settings:
- **Admin WhatsApp**: +233540456414
- **Default User Phone**: 0540456414 (configurable)
- **Auto-generation**: Disabled by default
- **Code Format**: BECE + 4 random characters

## Testing Instructions

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Access Application**:
   - URL: http://localhost:5174
   - Login: admin@bece.edu / admin123

3. **Test Code Generation**:
   - Go to Admin Dashboard
   - Find Auto Code Generator section
   - Enter phone number: 0540456414
   - Click "Generate for Admin (+233540456414)"
   - Verify WhatsApp links open correctly

4. **Expected Behavior**:
   - New code generated (e.g., BECE1234)
   - User WhatsApp opens with code message
   - Admin WhatsApp opens with notification
   - Success message displays in UI
   - Current code updates in dashboard

## Production Deployment

### For Real WhatsApp API Integration:
1. Replace `window.open(whatsappUrl)` with actual API calls
2. Use WhatsApp Business API for automated messaging
3. Set up webhook for incoming message handling
4. Implement proper error handling and retry logic

### Environment Variables:
```env
ADMIN_WHATSAPP_NUMBER=233540456414
WHATSAPP_API_KEY=your_api_key
WHATSAPP_BUSINESS_ID=your_business_id
```

## Security Notes

- Admin WhatsApp number is hardcoded as +233540456414
- All code generation activities are logged
- Access codes expire after 24 hours
- Phone numbers are validated and formatted
- Only admin users can generate codes

## Future Enhancements

1. **Bulk Code Generation**: Send codes to multiple users
2. **Code Request Tracking**: Monitor and manage code requests
3. **Analytics Dashboard**: Track distribution statistics
4. **Automated Responses**: Handle incoming WhatsApp messages
5. **Code Expiration**: Implement automatic code rotation

---

**Last Updated**: October 2, 2025
**Admin Contact**: +233540456414
**Platform**: BECE 2026 Prediction Platform
