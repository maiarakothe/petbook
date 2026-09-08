"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Search, User } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo-lado.png"
            alt="Logo do PetBook"
            width={160}
            height={40}
            priority
          />
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/"
            className={`${styles.link} ${isActive("/") ? styles.active : ""}`}
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </Link>

          <Link
            href="/adocao"
            className={`${styles.link} ${isActive("/adocao") ? styles.active : ""}`}
          >
            <Heart className="w-5 h-5" />
            <span>Adoção</span>
          </Link>

          <Link
            href="/perdidos"
            className={`${styles.link} ${isActive("/perdidos") ? styles.active : ""}`}
          >
            <Search className="w-5 h-5" />
            <span>Animais perdidos</span>
          </Link>

          <Link
            href="/perfil"
            className={`${styles.link} ${isActive("/perfil") ? styles.active : ""}`}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}