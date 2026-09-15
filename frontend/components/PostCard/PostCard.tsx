"use client";

import styles from "./PostCard.module.css";
import Image from "next/image";

import { Star, MessageCircle } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  petName: string;
  type: string;
  image: string;
  caption: string;
}

export default function PostCard({
  petName,
  type,
  image,
  caption,
}: PostCardProps) {
  const [curtido, setCurtido] = useState(false)
  return (
    <article className={styles.card}>

      <div className={styles.header}>

        <div className={styles.pet}>
          <div className={styles.avatar}>
            🐶
          </div>

          <div>
            <strong>{petName}</strong>
          </div>
        </div>

        <span className={styles.type}>
          {type}
        </span>

      </div>


      <Image
        src={image}
        alt={`Foto de ${petName}`}
        className={styles.image}
        width={200}
        height={50}
      />
      <div className={styles.content}>

        <p>{caption}</p>

        <div className={styles.actions}>

          <button type="button" onClick={() => setCurtido(!curtido)} className={curtido ? styles.liked : ""}>
            <Star size={22} fill={curtido ? "currentColor" : "none"} />
            <span>24</span>
          </button>

          <button >
            <MessageCircle size={22} />
            <span>8</span>
          </button>
        </div>

      </div>

    </article>
  );
}