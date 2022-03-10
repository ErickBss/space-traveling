import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.containerHeader}>
      <img src="/Logo.svg" alt="logo" />
    </header>
  );
}
