import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import BusinessCard from "../components/public/BusinessCard";
import styles from "./CardPage.module.css";

export default function CardPage() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("cards")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else {
          setCard(data);
          document.title = `${data.name} | Business Card`;
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.center}>
        <p className={styles.notFound}>Card not found.</p>
      </div>
    );
  }

  return <BusinessCard card={card} />;
}
