import { VenueGrid } from "./Wedding";

export default function Birthday({ venues, title = "Amazing Birthday Party Venues" }) {
  return <VenueGrid title={title} venues={venues} />;
}
