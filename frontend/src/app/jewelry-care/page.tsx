import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Jewelry care",
};

export default function JewelryCarePage() {
  return (
    <InfoPage
      title="Jewelry care"
      intro="A little care keeps your pieces shining for years."
    >
      <InfoSection heading="Gold-plated & vermeil">
        <p>Put your jewelry on last, after perfume, lotion and hairspray.</p>
        <p>
          Take it off before swimming, showering or working out. Chlorine and
          sweat wear down the plating faster.
        </p>
        <p>Wipe gently with a soft, dry cloth after wearing.</p>
      </InfoSection>
      <InfoSection heading="Stainless steel">
        <p>
          Stainless steel pieces are waterproof and tarnish-resistant. Rinse
          with warm water and mild soap, then dry fully.
        </p>
      </InfoSection>
      <InfoSection heading="Sterling silver">
        <p>
          Silver can darken over time when exposed to air. Store it in a sealed
          pouch and polish with a silver cloth to bring back the shine.
        </p>
      </InfoSection>
      <InfoSection heading="Bags">
        <p>
          Keep bags out of direct sunlight and stuff them with paper when not
          in use so they hold their shape. Wipe leather and vegan leather with
          a damp cloth; don’t soak them.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
