/**
 * Dekorative Rand- und Vordergrundebenen des Showrooms (rein visuell).
 *
 * Alle Elemente sind weich freigestellte Ausschnitte aus der Designreferenz
 * Orga/assets/01_showroom.png (WebP mit Alpha, public/images/showroom/decor/):
 * Holzdecke mit Spots oben rechts, Pflanzenstreifen am linken/rechten Rand,
 * unscharfes Bodenband mit Pflanze, Tischen und Sofa im Vordergrund.
 * Die CSS-Groessen sind auf die 1536 px breite Referenz bezogen (vw), damit
 * die Teile im selben Massstab zueinander stehen wie im Referenzbild.
 *
 * Alles aria-hidden und pointer-events:none (via CSS); Tiefe durch Parallax
 * je Ebene (--px/--py aus ShowroomPage).
 */
const DECOR = '/images/showroom/decor';

export function ShowroomDecor() {
  return (
    <>
      <DecorImg className="room__ceiling" src={`${DECOR}/ceiling.webp`} />
      <div className="room__lights" aria-hidden="true" />
      <DecorImg className="room__plant room__plant--left" src={`${DECOR}/edge-plant-left.webp`} />
      <DecorImg className="room__plant room__plant--right" src={`${DECOR}/edge-plant-right.webp`} />
      <DecorImg className="room__fg" src={`${DECOR}/floor-front.webp`} />
    </>
  );
}

function DecorImg({ className, src }: { className: string; src: string }) {
  return <img className={className} src={src} alt="" aria-hidden="true" draggable={false} decoding="async" />;
}
