import PostCard from "@/components/PostCard/PostCard";

export default function Feed() {
  return (
    <main>

      <h1>Feed</h1>

      <PostCard
        petName="Thor"
        image="/images/thor.jpg"
        caption="Dia de passeio!"
        type="Publicação"
      />

      <PostCard
        petName="Luna"
        image="/images/luna.jpg"
        caption="Procurando um novo lar."
        type="Adoção"
      />

    </main>
  );
}