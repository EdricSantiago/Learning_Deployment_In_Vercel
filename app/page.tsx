import { supabase } from "@/supabase";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

type Post = { id: number; title: string; created_at: string };

async function PostList() {
    await connection(); // data selalu diambil segar, bukan di-cache

    const { data, error } = await supabase
        .from("posts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });

    if (error) return <p>Error: {error.message}</p>;
    const posts = (data ?? []) as Post[];
    if (posts.length === 0) return <p>No posts yet.</p>;

    return (
        <ul className="list-group">
            {posts.map(post => (
                <li key={post.id} className="list-group-item">
                    <Link href={`/post/${post.id}`}>{post.title}</Link>
                    <span className="text-muted float-end">
                        {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function Home() {
    return (
        <main className="container mt-4">
            <h1>Blog Posts</h1>
            <Link href="/create" className="btn btn-primary mb-3">
                Create Post
            </Link>
            <Suspense fallback={<p>Loading...</p>}>
                <PostList />
            </Suspense>
        </main>
    );
}
