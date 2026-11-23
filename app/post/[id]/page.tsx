"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Post = { id: number; title: string; content: string; created_at: string };

function PostContent() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        fetch(`/api/posts/${id}`).then(async res => {
            if (res.status === 404) router.push("/not-found");
            else setPost(await res.json());
        });
    }, [id, router]);

    const handleDelete = async () => {
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        window.location.assign("/");
    };

    if (!post) return <p className="container mt-4">Loading...</p>;

    return (
        <main className="container mt-4">
            <h1>{post.title}</h1>
            <p className="text-muted">{new Date(post.created_at).toLocaleDateString("id-ID")}</p>
            <p>{post.content}</p>
            <Link href={`/post/${id}/edit`} className="btn btn-warning me-2">
                Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
                Delete
            </button>
        </main>
    );
}

export default function PostDetail() {
    return (
        <Suspense fallback={<p className="container mt-4">Loading...</p>}>
            <PostContent />
        </Suspense>
    );
}