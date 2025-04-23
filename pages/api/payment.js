import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Validate HTTP method
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({
            error: 'Method Not Allowed',
            message: 'Only POST requests are accepted'
        });
    }

    // Validate request origin
    const referer = req.headers.referer;
    if (!referer || !referer.includes(process.env.NEXT_PUBLIC_BASE_URL)) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Invalid request origin'
        });
    }

    // Validate request body
    const { paymentMethodId, amount, currency = 'usd' } = req.body;

    if (!paymentMethodId || !amount) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Missing required fields: paymentMethodId, amount'
        });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Amount must be a positive number'
        });
    }

    try {// Create and confirm PaymentIntent
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            metadata: {
                integration_check: 'accept_a_payment',
                workshop: 'WDC_Payment'
            }
        });
        
        if (paymentIntent.status !== 'succeeded') {// Verify payment was successful
            throw new Error(`Payment failed with status: ${paymentIntent.status}`);
        }

        return res.status(200).json({// Return success response
            success: true,
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
        });

    } catch (err) {// Handle Stripe API errors
        console.error('Stripe API error:', err);// Log the error

        const errorType = err.type || 'api_error';// Handle specific Stripe errors
        const errorCode = err.code || 'payment_failed';

        return res.status(500).json({// Return error response
            error: 'Payment Failed',
            type: errorType,
            code: errorCode,
            message: err.message || 'Could not process payment',
            details: err.raw ? err.raw.message : undefined// Include raw Stripe error message
        });
    }
}