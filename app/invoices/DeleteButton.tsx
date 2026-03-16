"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = () => {
    if (!confirm("Delete this document?")) return;
    startTransition(async () => {
      const res = await fetch("/api/delete-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        router.refresh();
      }
    });
  };
  return (
    <button
      style={{ position: "absolute", top: 8, right: 8, fontSize: "0.9rem", color: "#b00", background: "none", border: "none", cursor: "pointer" }}
      onClick={handleDelete}
      disabled={pending}
      aria-label="Delete"
    >
      Delete
    </button>
  );
}