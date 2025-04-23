# WDC_Payment Stripe Payment Integration Workshop
This project demonstrates how to integrate Stripe payments into a Next.js application with a complete checkout flow.

Features
Secure payment processing with Stripe Elements
Server-side payment validation
Success page with auto-redirect
Responsive design
Error handling and validation

Key Components
1. Payment API (payment.js)
Validates request method and origin
Processes payment via Stripe API
Handles errors and returns appropriate responses
Verifies payment success before confirmation

2. Checkout Page (checkout.js)
Uses Stripe Elements for secure card input
Creates payment method client-side
Submits payment to the API endpoint
Shows loading states and error messages
Includes security indicators

3. Success Page (success.js)
Prevents direct access without completing payment
Shows payment confirmation
Auto-redirects after 5 seconds
Provides manual redirect option

Setup Instructions
Install dependencies:
npm install @stripe/stripe-js @stripe/react-stripe-js stripe

Create a .env.local file with your Stripe keys:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

Run the development server:
npm run dev

Security Features
Request origin validation
Server-side amount validation
Secure card element handling
No sensitive data in client-side code
Success page access control

Testing
Use the following test card numbers in Stripe test mode:
Success: 4242 4242 4242 4242
Requires authentication: 4000 0025 0000 3155
Decline: 4000 0000 0000 0002

Customization
To modify the payment amount:
Update the amount in checkout.js (in cents)
Update the display amount in the checkout form
Update the success page amount display

Dependencies
@stripe/stripe-js
@stripe/react-stripe-js
stripe
next
