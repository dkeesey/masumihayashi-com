import type { FC } from 'react';

interface OverviewProps {
  className?: string;
}

const Overview: FC<OverviewProps> = ({ className = '' }) => {
  return (
    <div className={`prose lg:prose-xl max-w-none ${className}`}>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Historical Context</h2>
        <p className="mb-4">
          On February 19, 1942, President Franklin D. Roosevelt signed Executive Order 9066, authorizing the forced removal and incarceration of over 120,000 Japanese Americans from the West Coast. This unprecedented action, driven by wartime hysteria and racial prejudice, led to the creation of ten concentration camps across remote areas of the United States.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">The Displacement</h2>
        <p className="mb-4">
          Families were given just days to dispose of their property and belongings, allowed to bring only what they could carry. The Japanese phrase <em className="font-semibold text-gray-900">shikata ga nai</em> (it cannot be helped) became a common expression of resignation to their fate. Yet through <em className="font-semibold text-gray-900">gamman</em> (endurance and perseverance), communities maintained their dignity and cultural traditions within the confines of barbed wire.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Collective Memory</h2>
        <p className="mb-4">
          These panoramic photographs serve as both document and metaphor—a visual representation of the collective memory of Japanese Americans. Each image, composed of multiple photographs taken in a 360-degree rotation, creates a distorted yet complete view of these historic sites, much like memory itself.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">The Panopticon Theory</h2>
        <p className="mb-4">
          The camps' architecture embodied the concept of the panopticon—a circular prison with a central watchtower, designed to create a consciousness of permanent visibility. This architectural power dynamic reflected the psychological impact of constant surveillance on the incarcerated community.
        </p>
      </section>
    </div>
  );
};

export default Overview;
