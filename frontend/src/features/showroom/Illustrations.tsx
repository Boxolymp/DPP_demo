
import type { ProductGroup } from '../../content/showroom';

/**
 * Fotorealistische Produktbilder für den DPP-Showroom.
 * Ablage: public/images/showroom/<product-group-id>.webp
 */
export function Illustration({ id }: { id: ProductGroup['id'] }) {
  return (
    <img
      className="showroom-product-image"
      src={`/images/showroom/${id}.webp`}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading={id === 'batteries' ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}