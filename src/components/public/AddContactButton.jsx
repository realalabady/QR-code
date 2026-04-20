import { downloadVCard } from "../../lib/vcf";
import styles from "./AddContactButton.module.css";

export default function AddContactButton({ card }) {
  return (
    <button className={styles.button} onClick={() => downloadVCard(card)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="20"
        height="20"
      >
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6 12H6v-.6c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z" />
      </svg>
      Add Contact
    </button>
  );
}
