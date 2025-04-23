import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './Success.module.css';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {// Prevent direct access to this page without completing payment
    if (!document.referrer.includes('/checkout')) {
      router.push('/');
      return;
    }

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Payment Successful</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.checkmark}>✓</div>
          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.message}>
            Thank you for your purchase. A receipt has been sent to your email.
          </p>
          <div className={styles.details}>
            <p>Amount: <strong>$10.00</strong></p>
            <p>Transaction completed successfully</p>
          </div>
          <div className={styles.redirectInfo}>
            <p>You'll be redirected to the homepage in 10 seconds...</p>
            <button
              onClick={() => router.push('/')}
              className={styles.homeButton}
            >
              Return Home Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}