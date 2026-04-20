import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import styles from "./CardForm.module.css";

const EMPTY = {
  name: "",
  slug: "",
  job_title: "",
  email: "",
  company: "",
  phones: [""],
  location_text: "",
  location_map_url: "",
  linkedin_url: "",
  whatsapp_number: "",
  profile_photo_url: "",
  logo_url: "",
};

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(name) {
  const base = slugify(name);
  const suffix = Math.random().toString(36).slice(2, 7); // 5-char random e.g. "a3k9x"
  return `${base}-${suffix}`;
}

export default function CardForm({ initialData, onSave }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialData || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Auto-generate slug from name only when creating a new card
  useEffect(() => {
    if (!initialData && form.name) {
      setForm((prev) => ({ ...prev, slug: uniqueSlug(form.name) }));
    }
  }, [form.name, initialData]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setPhone(index, value) {
    const phones = [...form.phones];
    phones[index] = value;
    setForm((prev) => ({ ...prev, phones }));
  }

  function addPhone() {
    setForm((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
  }

  function removePhone(index) {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  }

  async function uploadImage(file, folder) {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("card-assets")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("card-assets").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadImage(file, "profiles");
      set("profile_photo_url", url);
    } catch (err) {
      setError("Photo upload failed: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadImage(file, "logos");
      set("logo_url", url);
    } catch (err) {
      setError("Logo upload failed: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        phones: form.phones.filter(Boolean),
      };
      await onSave(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Identity</h2>
        <div className={styles.row}>
          <label className={styles.label}>
            Full Name *
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Slug (URL key) *
            <input
              className={styles.input}
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              required
              pattern="[a-z0-9\-]+"
              title="Lowercase letters, numbers and hyphens only"
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Job Title
            <input
              className={styles.input}
              value={form.job_title}
              onChange={(e) => set("job_title", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Company
            <input
              className={styles.input}
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </label>

        <div className={styles.phonesSection}>
          <span className={styles.phoneLabel}>Phone Numbers</span>
          {form.phones.map((phone, i) => (
            <div key={i} className={styles.phoneRow}>
              <input
                className={styles.input}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(i, e.target.value)}
                placeholder="+1 234 567 8900"
              />
              {form.phones.length > 1 && (
                <button
                  type="button"
                  className={styles.removePhone}
                  onClick={() => removePhone(i)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addPhone} onClick={addPhone}>
            + Add Phone
          </button>
        </div>

        <label className={styles.label}>
          WhatsApp Number (with country code)
          <input
            className={styles.input}
            type="tel"
            value={form.whatsapp_number}
            onChange={(e) => set("whatsapp_number", e.target.value)}
            placeholder="+966501234567"
          />
        </label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Location</h2>
        <label className={styles.label}>
          Location Text
          <input
            className={styles.input}
            value={form.location_text}
            onChange={(e) => set("location_text", e.target.value)}
            placeholder="Riyadh, Saudi Arabia"
          />
        </label>
        <label className={styles.label}>
          Google Maps URL
          <input
            className={styles.input}
            type="url"
            value={form.location_map_url}
            onChange={(e) => set("location_map_url", e.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Social</h2>
        <label className={styles.label}>
          LinkedIn URL
          <input
            className={styles.input}
            type="url"
            value={form.linkedin_url}
            onChange={(e) => set("linkedin_url", e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Images</h2>
        <div className={styles.row}>
          <label className={styles.label}>
            Profile Photo
            <input
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            {uploadingPhoto && (
              <span className={styles.uploading}>Uploading…</span>
            )}
            {form.profile_photo_url && (
              <img
                src={form.profile_photo_url}
                className={styles.preview}
                alt="Profile"
              />
            )}
          </label>
          <label className={styles.label}>
            Company Logo
            <input
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            {uploadingLogo && (
              <span className={styles.uploading}>Uploading…</span>
            )}
            {form.logo_url && (
              <img
                src={form.logo_url}
                className={styles.previewLogo}
                alt="Logo"
              />
            )}
          </label>
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
        <button className={styles.saveButton} type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Card"}
        </button>
      </div>
    </form>
  );
}
