"use client";
import { useTransition } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      await fetch("/api/delete-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      window.location.reload();
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