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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
    //setEmailSent(false);
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "48px",
        width: "100%",
      }}
    >
      <style>{`
        .newdoc-action-btn {
          display: block;
          width: 100%;
          padding: 12px 20px;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #f9f9f9;
          color: #222;
          text-decoration: none;
          text-align: center;
          transition: background 0.15s ease;
          cursor: pointer;
        }
        .newdoc-action-btn:hover:not(:disabled) {
          background: #f0f0f0;
        }
        .newdoc-action-btn:disabled {
          background: #f3f3f3;
          color: #aaa;
          cursor: not-allowed;
        }
        .newdoc-controls {
          width: 100%;
          max-width: 400px;
        }
        .newdoc-preview {
          width: 100%;
          max-width: 400px;
          padding: 32px 20px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-top: 28px;
          text-align: left;
          line-height: 1.7;
        }
      `}</style>

          <div style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}>
            <a
              href={backHref}
              style={{
                fontSize: "1rem",
                color: "#0070f3",
                textDecoration: "underline",
              }}
            >
              {backText}
            </a>
          </div>

      <h1 style={{ fontSize: "2rem", marginBottom: "32px" }}>
        {`Create ${displayTitle}`}
      </h1>

      <div className="newdoc-controls" style={{ marginBottom: '24px' }}>
        <input
          id="field-doc-upload"
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(e) =>
            setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])
          }
          style={{ display: "none" }}
          disabled={loading}
        />
        <label
          htmlFor="field-doc-upload"
          style={{
            display: "block",
            width: "100%",
            padding: "12px 20px",
            fontSize: "1.1rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#f9f9f9",
            color: "#222",
            textAlign: "center",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          {files.length === 0 ? "Upload Images" : "Add More Images"}
        </label>
        {files.length > 0 && (
          <div style={{ marginTop: "8px", fontSize: "0.95rem", color: "#555" }}>
            {files.map((file, index) => (
              <div key={file.name}>
                Image {index + 1} uploaded
                <button
                  type="button"
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                  style={{ marginLeft: "10px", fontSize: "0.9em", padding: "2px 8px", color: "red" }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="newdoc-controls" style={{ marginBottom: "16px" }}>
        <button
          className="newdoc-action-btn"
          onClick={handleGenerate}
          disabled={loading || files.length === 0}
        >
          Generate
        </button>
      </div>

      <div className="newdoc-controls" style={{ marginBottom: "16px" }}>
        <button
          className="newdoc-action-btn"
          onClick={handleSave}
          disabled={!generated || saved || loading}
        >
          Save
        </button>
      </div>

      <div className="newdoc-preview">
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
    </div>
  );
}