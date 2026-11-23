"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Post = { id: number; title: string; content: string; created_at: string };

function EditForm() {
    const { id } = useParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/posts/${id}`).then(async res => {
            if (res.status === 404) {
                router.push("/not-found");
                return;
            }
            const post: Post = await res.json();
            setTitle(post.title);
            setContent(post.content);
            setLoaded(true);
        });
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                setError(body?.error ?? "Gagal menyimpan perubahan");
                setSaving(false);
                return;
            }

            window.location.assign(`/post/${id}`);
        } catch {
            setError("Terjadi kesalahan jaringan");
            setSaving(false);
        }
    };

    if (!loaded) return <p className="container mt-4">Loading...</p>;

    return (
        <main className="container mt-4">
            <h1>Edit Post</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        rows={5}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-success me-2" disabled={saving}>
                    {saving ? "Menyimpan..." : "Update"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => router.push(`/post/${id}`)}>
                    Batal
                </button>
            </form>
        </main>
    );
}

export default function EditPost() {
    return (
        <Suspense fallback={<p className="container mt-4">Loading...</p>}>
            <EditForm />
        </Suspense>
    );
}