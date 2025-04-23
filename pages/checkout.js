import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import Head from 'next/head';
import styles from './Checkout.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false); // Track loading state
    const [paymentError, setPaymentError] = useState(null); // Track payment errors

    const handleSubmit = async (e) => { // Handle form submission
        e.preventDefault(); /// Prevent default form submission
        setLoading(true); // Set loading state
        setPaymentError(null); // Clear payment errors

        if (!stripe || !elements) { // Check if Stripe and elements are available
            setLoading(false);
            return;
        }

        try {
            // 1. Create payment method
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({// Create payment method
                type: 'card',
                card: elements.getElement(CardElement),// Get card element
            });

            if (stripeError) {// Handle Stripe errors
                throw stripeError;
            }

            // 2. Process payment
            const response = await fetch('/api/payment', {// Make payment request
                method: 'POST',// Use POST method
                headers: { 'Content-Type': 'application/json' },// Set content type
                body: JSON.stringify({// Send payment details
                    paymentMethodId: paymentMethod.id,// Payment method ID
                    amount: 1000, // $10.00 in cents
                    currency: 'usd'
                }),
            });

            const data = await response.json();

            if (!response.ok) {// Handle payment errors
                throw new Error(data.error || 'Payment failed');
            }

            // 3. Redirect to success page
            window.location.href = '/success';

        } catch (err) {
            setPaymentError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.checkoutContainer}>
            <Head>
                <title>Checkout | Payment Workshop</title>
            </Head>

            <div className={styles.checkoutCard}>
                <h1 className={styles.checkoutTitle}>Complete Payment</h1>
                <p className={styles.checkoutSubtitle}>$10.00 Workshop Fee</p>

                <form onSubmit={handleSubmit} className={styles.paymentForm}>
                    <div className={styles.paymentSection}>
                        <h3 className={styles.sectionTitle}>Card Details</h3>
                        <div className={styles.cardElementContainer}>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#e63946',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {paymentError && (
                        <div className={styles.errorMessage}>
                            {paymentError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className={styles.payButton}
                    >
                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Processing...
                            </>
                        ) : (
                            'Pay $10.00'
                        )}
                    </button>
                </form>

                <div className={styles.securityNotice}>
                    <svg className={styles.lockIcon} viewBox="0 0 24 24">
                        <path d="M12 1C8.676 1 6 3.676 6 7v1H4v14h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                    </svg>
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>
        </div>
    );
};

export default function CheckoutPage() { 
    return (
        <div className={styles.pageContainer}>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
}