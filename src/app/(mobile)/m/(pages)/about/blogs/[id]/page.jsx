import SingleBlogPageWrapper from "@/components/mobile/PagesWrapper/SingleBlogPageWrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = await resolvedParams?.id;
  const formattedTitle = id ? id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Blog Post";

  return {
    title: `${formattedTitle} | PlanWAB Blog`,
    description: `Read the latest insights and tips about ${formattedTitle}.`,
  };
}

export default function SingleBlogPage() {
  return (
    <>
      <SingleBlogPageWrapper />
    </>
  );
}
