import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import CardForm from "../components/admin/CardForm";
import styles from "./CardEditor.module.css";

export default function CardEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error) setError(error.message);
          else setInitialData(data);
          setLoading(false);
        });
    }
  }, [id, isNew]);

  async function handleSave(formData) {
    if (isNew) {
      const { data, error } = await supabase
        .from("cards")
        .insert([formData])
        .select()
        .single();
      if (error) throw error;
      navigate("/dashboard");
    } else {
      const { error } = await supabase
        .from("cards")
        .update(formData)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      navigate("/dashboard");
    }
  }

  if (loading) return <p className={styles.info}>Loading…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{isNew ? "New Card" : "Edit Card"}</h1>
      <CardForm initialData={initialData} onSave={handleSave} />
    </div>
  );
}
