"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import CreatePostBox from "@/components/CreatePostBox/CreatePostBox";
import PostCard from "@/components/PostCard/PostCard";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("petbook_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <div className="layout">
        <main className="feed">
          <CreatePostBox />

          <PostCard
            petName="Thor"
            type="Publicação"
            image="/images/dog-placeholder.jpg"
            caption="Hoje foi dia de passeio!"
          />

          <PostCard
            petName="Luna"
            type="Adoção"
            image="/images/cat-placeholder.jpg"
            caption="A Luna está procurando um novo lar."
          />
        </main>
      </div>
    </div>
  );
}