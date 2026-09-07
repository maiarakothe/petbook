import Header from "@/components/Header/Header";

import PostCard from "@/components/PostCard/PostCard";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="layout">
     

        <main className="feed">
          <h1>Olá, PetBook! 🐾</h1>

          <p className="subtitle">
            Veja o que está acontecendo com os pets da comunidade.
          </p>

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