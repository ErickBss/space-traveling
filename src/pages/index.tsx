import Header from '../components/Header';

import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      <Header />

      <main className={styles.container}>
        <h1>Como utilizar Hooks</h1>
        <h3>Pensando em sincronização em vez de ciclos de vida.</h3>
        <div className={styles.infoContent}>
          <time>15 Mar 2021</time>
          <p>Erick Basso</p>
        </div>
      </main>
    </>
  );
}
