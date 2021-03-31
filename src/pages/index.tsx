// import { GetServerSideProps } from 'next' -> faz chamadas mesmo ja tendo o html pronto no next
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss';
import { stripe } from "../services/stripe";

// client-side -> nao necessito indexacao
// Server-side -> necessito de indexacao porem tenho que carregar a cada chamada
// Static-Site Generation -> necessito de indexacao porem muito igual pore um detgerminado de tempo

// post do blog

// conteudo -> SSG
// comentario -> (Cliente-side)

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏  Hey, welcome</span>
          <h1>News about the <span>React</span> word.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Ib3PCGQUUMP3fHtv9Vcqz75', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount/100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 * 30, // 24 hours * 30 dias
  }
}