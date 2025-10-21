import React from 'react';

export const About: React.FC = () => {
  return (
    <article className="prose prose-lg max-w-none">
      <header className="mb-8">
        <h1>About Masumi Hayashi (1945-2006)</h1>
      </header>

      <section>
        <p>
          Masumi Hayashi was a renowned Japanese American photographer and artist, best 
          known for her panoramic photo collages of landscapes and interiors. Her work 
          often explored themes of memory, history, and cultural identity, with a 
          particular focus on Japanese American internment camps and abandoned prisons.
        </p>
      </section>

      <section>
        <h2>Early Life and Education</h2>
        <p>
          Born in 1945 in the Gila River War Relocation Center in Rivers, Arizona, 
          Hayashi's early life was shaped by the experience of Japanese American 
          internment during World War II. After the war, her family moved to Los Angeles, 
          where she grew up.
        </p>

        <p>Hayashi pursued her education in art, earning her:</p>
        <ul>
          <li>BA from Florida State University in 1975</li>
          <li>MFA from Florida State University in 1977</li>
        </ul>
      </section>

      <section>
        <h2>Artistic Career</h2>
        <p>
          Hayashi began her teaching career at Cleveland State University in 1982, where 
          she became a Professor of Photography. Her distinctive panoramic photo collage 
          technique became her signature style, allowing her to capture both the physical 
          and emotional dimensions of historically significant places.
        </p>
        <p>
          Her work has been exhibited internationally and is included in the permanent 
          collections of the Los Angeles County Museum of Art, the Japanese American 
          National Museum, and the International Museum of Photography at George Eastman 
          House, among others.
        </p>
      </section>

      <section>
        <h2>Legacy</h2>
        <p>
          Masumi Hayashi's work continues to serve as a powerful testament to the 
          importance of remembering and documenting historical sites of trauma and 
          resilience. Her panoramic photographs of Japanese American concentration camps 
          stand as both historical documents and works of art, helping to preserve the 
          memory of this crucial chapter in American history.
        </p>
      </section>
    </article>
  );
};

export default About;
