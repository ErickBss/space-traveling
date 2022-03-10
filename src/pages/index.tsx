import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';

import Header from '../components/Header';

import styles from './home.module.scss';
import Head from 'next/head';
import { GetStaticProps } from 'next';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <Header />

      <main className={styles.container}>
        <section className={styles.articleBlocks}>
          <h1>Como utilizar Hooks</h1>
          <h3>Pensando em sincronização em vez de ciclos de vida.</h3>
          <div className={styles.infoContent}>
            <div>
              <i>
                <AiOutlineCalendar />
              </i>
              <time>15 Mar 2021</time>
            </div>

            <div>
              <i>
                <FiUser />
              </i>
              <p>Erick Basso</p>
            </div>
          </div>
        </section>

        <section className={styles.articleBlocks}>
          <h1>Como utilizar Hooks</h1>
          <h3>Pensando em sincronização em vez de ciclos de vida.</h3>
          <div className={styles.infoContent}>
            <div>
              <i>
                <AiOutlineCalendar />
              </i>
              <time>15 Mar 2021</time>
            </div>

            <div>
              <i>
                <FiUser />
              </i>
              <p>Erick Basso</p>
            </div>
          </div>
        </section>
        <a>Carregar mais posts</a>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = {};
  return {
    props: {},
  };
};
