import React from 'react';
import styles from './Sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className={styles.sidebarMain}>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sideLogo}>
            <Image
              src="/logo.png"
              alt="Logo DyA Minimarket"
              width={50}
              height={50}
              className={styles.logo}
            />
            <span>DyA Minimarket</span>
          </div>
        </div>

        <div className={styles.sidebarMenu}>
          <div className={styles.section}>
            <div className={styles.sideSubtitle}>ALMACÉN</div>
            <div className={styles.sideNavs}>
              <Link href="/" className={`${styles.navItem} ${styles.active}`}>
                <svg
                  className={styles.sideNavIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="none"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <span>Inventario</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

