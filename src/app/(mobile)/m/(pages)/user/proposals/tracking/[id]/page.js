import ProposalTrackingPageWrapper from "@/components/mobile/PagesWrapper/TrackingProposalsPagewrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const shortId = id ? id.slice(0, 8).toUpperCase() : "";

  return {
    title: `Proposal Tracking${shortId ? ` — #${shortId}` : ""} | PlanWAB`,
    description: `Track the real-time status of your event proposal${shortId ? ` #${shortId}` : ""} on PlanWAB.`,
  };
}

export default function ProposalTrackingPage() {
  return (
    <>
      <ProposalTrackingPageWrapper />
    </>
  );
}
