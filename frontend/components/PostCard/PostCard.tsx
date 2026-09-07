import styles from "./PostCard.module.css";
import Image from "next/image";

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
          <button>♡ Curtir</button>
          <button>💬 Comentar</button>
        </div>

      </div>

    </article>
  );
}