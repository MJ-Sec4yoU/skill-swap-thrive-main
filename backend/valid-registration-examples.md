# ✅ Valid Registration Examples

## Copy these examples for testing:

### Example 1: Basic User
```json
{
  "name": "John Smith",
  "email": "john.smith@email.com", 
  "password": "MyPassword123"
}
```

### Example 2: User with Hyphen
```json
{
  "name": "Mary-Jane Watson",
  "email": "maryjane@example.com",
  "password": "SpiderWeb1"
}
```

### Example 3: User with Apostrophe  
```json
{
  "name": "O'Connor Patrick",
  "email": "patrick.oconnor@test.com",
  "password": "Irish123"
}
```

### Example 4: Professional Name
```json
{
  "name": "Dr. Sarah Johnson",
  "email": "dr.johnson@hospital.org",
  "password": "Medical123"
}
```

## ❌ Common Mistakes to Avoid:

### Invalid Names:
- "User123" (contains numbers)
- "John_Doe" (contains underscore)
- "Test@User" (contains @ symbol)
- "user" (might be too generic, use full name)

### Invalid Emails:
- "user@" (incomplete)
- "invalid-email" (no domain)
- "@example.com" (no username)

### Invalid Passwords:
- "password" (no uppercase, no numbers)
- "PASSWORD" (no lowercase, no numbers) 
- "Pass1" (too short, minimum 6 characters)
- "MyPassword" (no numbers)

## 🧪 Test Your Data:

Before submitting registration, check:
1. ✅ Name contains only letters, spaces, hyphens, apostrophes, periods
2. ✅ Email has valid format: username@domain.extension
3. ✅ Password is 6+ chars with uppercase, lowercase, and number
4. ✅ All fields are filled out

## 🎯 Frontend Form Tips:

If you're building a frontend form:
- Add client-side validation matching these rules
- Show real-time validation feedback
- Display password requirements clearly
- Use input type="email" for email validation