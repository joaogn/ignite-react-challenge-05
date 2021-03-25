import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <section>
        <Link href="/">
          <img src="/images/logo.png" alt="logo" />
        </Link>
      </section>
    </header>
  );
}
