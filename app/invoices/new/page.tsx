"use client";
import { useState } from "react";

// Fixed company info block for documents
const COMPANY_INFO_HTML = `
  <div style="margin-bottom: 16px;">
    <h2 style="margin:0 0 4px 0;font-size:1.35em;font-weight:bold;">MPH Construction and Painting</h2>
    720-883-5097<br>
    303-249-4563<br>
    mhirsch60@hotmail.com<br>
    9426 Troon Village Way<br>
    Lone Tree, CO 80124
  </div>
`;

// Bill To section for documents
const BILL_TO_HTML = `
  <div style="margin-bottom: 16px;">
    <strong style="font-size: 16px;">Bill To:</strong><br>
    Client Name<br>
    Client Address
  </div>
`;

export default function NewInvoice() {
  const documentConfig = {
    invoice: { hasPricing: true, pricingLabel: "Total Due" },
    proposal: { hasPricing: true, pricingLabel: "Estimated Total" },
    inspection: { hasPricing: false, pricingLabel: "" },
  };

  const documentType: "invoice" | "proposal" | "inspection" = "invoice";
  const backHref = "/invoices";
  const backText = "Back to Field Documents";

  const titleMap = {
    invoice: "Field Document",
    proposal: "Proposal",
    inspection: "Inspection",
  };

  const displayTitle = titleMap[documentType];

  const [generated, setGenerated] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    const hasMaterials = false;
    const materialsNotIncluded = false;
    const config = documentConfig[documentType];
    const hasPricing = config.hasPricing;
    const pricingLabel = config.pricingLabel;

    let html = COMPANY_INFO_HTML;
    html += BILL_TO_HTML;
    html +=
      '<div style="margin-bottom: 16px;"><strong style="font-size: 16px;">Scope of Work</strong><br>Paint interior walls and ceilings.</div>';

    if (hasMaterials) {
      html +=
        '<div style="margin-bottom: 16px;"><strong style="font-size: 16px;">Materials</strong><br>List of materials goes here.</div>';
    }

    if (materialsNotIncluded) {
      html +=
        '<div style="margin-bottom: 16px; color: #a00;"><strong style="font-size: 16px;">Materials Not Included</strong><br>Client is responsible for providing materials.</div>';
    }

    if (hasPricing) {
      html += `<div style="margin-bottom: 16px;"><strong style="font-size: 16px;">${pricingLabel}</strong><br/>$2,500</div>`;
    }

    setGenerated(html);
    setSaved(false);
    setEmailSent(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!generated) return;

    setLoading(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/save-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: documentType,
          title: documentType,
          content_html: generated,
        }),
      });

      if (res.ok) {
        setSaved(true);
      } else {
        setError("Failed to save document.");
      }
    } catch {
      setError("Failed to save document.");
    }

    setLoading(false);
  };

  const handleEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
    }, 500);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "48px",
      }}
    >
      <a
        href={backHref}
        style={{
          alignSelf: "flex-start",
          marginBottom: "16px",
          fontSize: "1rem",
          color: "#0070f3",
          textDecoration: "underline",
        }}
      >
        {backText}
      </a>

      <h1 style={{ fontSize: "2rem", marginBottom: "32px" }}>
        {`Create ${displayTitle}`}
      </h1>

      <input
        type="file"
        accept="image/*"
        style={{ marginBottom: "24px", fontSize: "1rem" }}
        disabled={loading}
      />

      <button
        style={{ padding: "16px 32px", fontSize: "1.1rem", marginBottom: "16px" }}
        onClick={handleGenerate}
        disabled={loading}
      >
        Generate
      </button>

      <button
        style={{ padding: "12px 24px", fontSize: "1rem", marginBottom: "16px" }}
        onClick={handleSave}
        disabled={!generated || saved || loading}
      >
        Save
      </button>

      <button
        style={{ padding: "12px 24px", fontSize: "1rem", marginBottom: "16px" }}
        onClick={handleEmail}
        disabled={!saved || emailSent || loading}
      >
        Email
      </button>

      <div
        style={{
          marginTop: "32px",
          fontSize: "1rem",
          color: "#222",
          border: "1px solid #ddd",
          background: "#fff",
          padding: "40px 48px",
          width: "100%",
          maxWidth: "700px",
          minHeight: "48px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          textAlign: "left",
          borderRadius: "6px",
          lineHeight: 1.7,
        }}
      >
        {generated ? (
          <span dangerouslySetInnerHTML={{ __html: generated }} />
        ) : (
          `Generated ${displayTitle.toLowerCase()} will appear here.`
        )}
      </div>

      {saved && (
        <div style={{ color: "green", marginTop: "8px" }}>
          Field Document saved. You can open saved documents from the library for viewing later.
        </div>
      )}

      {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}

      {emailSent && (
        <div style={{ color: "blue", marginTop: "8px" }}>
          {displayTitle} emailed.
        </div>
      )}
    </div>
  );
}