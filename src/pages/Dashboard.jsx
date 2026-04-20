import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import QRDisplay from "../components/admin/QRDisplay";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setCards(data);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    const { error } = await supabase.from("cards").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Business Cards</h1>
        <div className={styles.headerActions}>
          <Link to="/dashboard/new" className={styles.newButton}>
            + New Card
          </Link>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {loading && <p className={styles.info}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && cards.length === 0 && (
        <p className={styles.info}>No cards yet. Create your first one!</p>
      )}

      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.cardItem}>
            <div className={styles.cardInfo}>
              <p className={styles.cardName}>{card.name}</p>
              <p className={styles.cardSub}>{card.job_title}</p>
              <p className={styles.cardSub}>{card.company}</p>
              <div className={styles.cardActions}>
                <Link
                  to={`/dashboard/${card.id}/edit`}
                  className={styles.editButton}
                >
                  Edit
                </Link>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(card.id)}
                >
                  Delete
                </button>
                <a
                  href={`/card/${card.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.viewButton}
                >
                  View Card
                </a>
              </div>
            </div>
            <div className={styles.qrWrap}>
              <QRDisplay slug={card.slug} name={card.name} size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
