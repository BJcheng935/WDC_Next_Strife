// pages/index.js
import Link from 'next/link';// We'll create this next
import styles from './Home.module.css'; 

export default function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Payment Workshop</h1>
                <p className={styles.description}>
                    Learn how to integrate Stripe payments in Next.js
                </p>

                <Link href="/checkout" className={styles.button}>
                    Go to Checkout
                </Link>
            </main>
        </div>
    )
}