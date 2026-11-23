import Link from "next/link";

export default function NotFound() {
    return (
        <main className="container mt-4">
            <h1>404 - Halaman tidak ditemukan</h1>
            <Link href="/" className="btn btn-primary">
                Kembali
            </Link>
        </main>
    );
}
