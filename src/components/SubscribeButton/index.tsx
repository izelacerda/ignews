import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStrypeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

// getServerSideProps (SSR)
// getStatisProps (SSG) - Static Site Generation
// Api Routes

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return;
    }
    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data
      const stripe = await getStrypeJs()
      await stripe.redirectToCheckout({ sessionId })
    } catch(err) { 
      console.log(err.message)
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe now
    </button>
  )
}
