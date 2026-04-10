import React from "react";
import SingleBlogPageWrapper from "../../../../../../components/desktop/PagesWrapper/SingleBlogPageWrapper";
import { getBlogById } from "../../../../../../database/actions/FetchActions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return {
      title: "Blog Post | PlanWAB Blog",
      description: "Read inspiring event planning tips and stories on PlanWAB Blog.",
    };
  }

  return {
    title: `${blog.title} | PlanWAB Blog`,
    description: blog.excerpt
      ? blog.excerpt.substring(0, 160)
      : `Read "${blog.title}" on PlanWAB Blog — written by ${blog.authorName}.`,
    openGraph: {
      title: `${blog.title} | PlanWAB Blog`,
      description: blog.excerpt ? blog.excerpt.substring(0, 160) : "",
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
  };
}

export default function SingleBlogPage() {
  return <SingleBlogPageWrapper />;
}

