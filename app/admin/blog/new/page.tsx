import { BlogForm } from "../BlogForm";

export default function Page() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl mb-6">New blog post</h1>
      <BlogForm />
    </div>
  );
}
