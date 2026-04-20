/**
 * Generates a vCard 3.0 string from a card object
 * and triggers a download in the browser.
 */
export function downloadVCard(card) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name || ""}`,
    card.job_title ? `TITLE:${card.job_title}` : "",
    card.company ? `ORG:${card.company}` : "",
    card.email ? `EMAIL:${card.email}` : "",
    ...(card.phones || []).map((p) => `TEL:${p}`),
    card.location_text ? `ADR:;;${card.location_text};;;;` : "",
    card.linkedin_url ? `URL;type=LinkedIn:${card.linkedin_url}` : "",
    card.whatsapp_number ? `TEL;type=WhatsApp:${card.whatsapp_number}` : "",
    card.profile_photo_url ? `PHOTO;VALUE=URI:${card.profile_photo_url}` : "",
    "END:VCARD",
  ];

  const blob = new Blob([lines.filter(Boolean).join("\n")], {
    type: "text/vcard",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(card.name || "contact").replace(/\s+/g, "_")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
