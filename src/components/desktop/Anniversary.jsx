import { VenueGrid } from "./Wedding";

export default function Anniversary({ venues, title = "Unforgettable Anniversary Venues" }) {
  return <VenueGrid title={title} venues={venues} />;
}