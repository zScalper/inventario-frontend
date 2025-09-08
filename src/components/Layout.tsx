import Sidebar from './Sidebar';
import styles from './Layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar children={undefined} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
