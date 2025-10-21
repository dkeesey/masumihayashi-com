import React from 'react';

export const Overview: React.FC = () => {
  return (
    <article className="prose prose-lg max-w-none">
      <section>
        <h2>Historical Context</h2>
        <p>
          On February 19, 1942, President Franklin D. Roosevelt signed Executive Order 9066, 
          authorizing the forced removal and incarceration of over 120,000 Japanese Americans 
          from the West Coast. This unprecedented action, driven by wartime hysteria and racial 
          prejudice, led to the creation of ten concentration camps across remote areas of the 
          United States.
        </p>
      </section>

      <section>
        <h2>The Displacement</h2>
        <p>
          Families were given just days to dispose of their property and belongings, allowed 
          to bring only what they could carry. The Japanese phrase "<em>shikata ga nai</em>" 
          (it cannot be helped) became a common expression of resignation to their fate. Yet 
          through "<em>gamman</em>" (endurance and perseverance), communities maintained their 
          dignity and cultural traditions within the confines of barbed wire.
        </p>
      </section>

      <section>
        <h2>Collective Memory</h2>
        <p>
          These panoramic photographs serve as both document and metaphor—a visual representation 
          of the collective memory of Japanese Americans who were incarcerated during World War II. 
          Each image is a careful reconstruction of space, pieced together from multiple photographs 
          to create a comprehensive view of these historic sites.
        </p>
        <p>
          The photographs capture what remains of these camps today: foundations, guard towers, 
          monuments, and the surrounding landscape that once contained thousands of lives. Through 
          these images, we confront not only the physical evidence of internment but also the 
          enduring impact of this historical injustice on the Japanese American community and 
          American society as a whole.
        </p>
      </section>
    </article>
  );
};

export default Overview;
