import ProposalTrackingPageWrapper from "@/components/mobile/PagesWrapper/TrackingProposalsPagewrapper";
import { getPlannedEventById } from "@/database/actions/FetchActions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = await getPlannedEventById(id);

  if (!event) {
    return {
      title: "Proposal Tracking | PlanWAB",
      description: "Track the real-time status of your event proposal on PlanWAB.",
    };
  }

  const formattedCategory = event.category
    ? event.category.charAt(0).toUpperCase() + event.category.slice(1)
    : "Event";
  const statusMap = {
    "pending": "Pending Review",
    "in-progress": "In Progress",
    "proposal-sent": "Proposal Ready",
    "confirmed": "Confirmed",
    "cancelled": "Cancelled",
  };
  const statusLabel = statusMap[event.status] || "Tracking";

  return {
    title: `${formattedCategory} Proposal — ${statusLabel} | PlanWAB`,
    description: `Track your ${formattedCategory} event proposal in ${event.city}. Current status: ${statusLabel}. Stay updated with PlanWAB's real-time tracking.`,
  };
}

export default function ProposalTrackingPage() {
  return (
    <>
      <ProposalTrackingPageWrapper />
    </>
  );
}

