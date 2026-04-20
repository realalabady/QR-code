import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styles from "./QRDisplay.module.css";

const BASE_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

export default function QRDisplay({ slug, name, size = 180 }) {
  const canvasRef = useRef(null);

  function handleDownload() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || slug).replace(/\s+/g, "_")}_QR.png`;
    a.click();
  }

  return (
    <div className={styles.wrap}>
      <div ref={canvasRef}>
        <QRCodeCanvas
          value={`${BASE_URL}/card/${slug}`}
          size={size}
          bgColor="#ffffff"
          fgColor="#111111"
          level="M"
          includeMargin
        />
      </div>
      {size > 120 && (
        <button className={styles.downloadBtn} onClick={handleDownload}>
          Download QR
        </button>
      )}
    </div>
  );
}
