/** Server-side helpers that build GA4 ecommerce-style params for data-track attributes. */
import type { TripView, TripOriginView, ResolvedDeparture } from './catalog';

export function itemParams(
  trip: TripView,
  origin: TripOriginView,
  opts: { listName?: string; index?: number; departure?: ResolvedDeparture | null } = {},
) {
  const price = opts.departure?.price ?? origin.fromPrice ?? undefined;
  return {
    item_list_name: opts.listName,
    trip_id: trip.id,
    trip_name: trip.data.title,
    destination: trip.destinationNames.join(', '),
    trip_type: trip.data.tripTypes[0],
    departure_city: origin.label,
    departure_date: opts.departure?.start ?? origin.next?.start,
    price,
    currency: 'INR',
    items: [
      {
        item_id: trip.id,
        item_name: trip.data.title,
        item_category: trip.data.tripTypes[0],
        item_variant: origin.city,
        price,
        index: opts.index,
      },
    ],
  };
}

export const toAttr = (o: object) => JSON.stringify(o);
