import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
export async function loader() {
  const blogPosts = await db.blog.findMany({
    where: {
      draft: false,
    },
  });
  return { blogPosts };
}
export default function Advice() {
  const { blogPosts } = useLoaderData<typeof loader>();
  return (
    <div>
      <ul>
        {blogPosts.map((blogPost) => (
          <div key={blogPost.id}>
            <li key={blogPost.id} className="mb-4 text-2xl font-bold">
              <a href={blogPost.title}>{blogPost.title}</a>
              {blogPost?.photoUrl && (
                <img
                  src={blogPost.photoUrl}
                  alt={blogPost.title}
                  className="h-12 border-2 border-black m-[20px]"
                />
              )}
            </li>
            <p key={blogPost.id}>{blogPost.body}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}
