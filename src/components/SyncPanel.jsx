import { useState } from "react";
import { hasConfig } from "../firebase";
import { generateSyncCode } from "../hooks/useCloudSync";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import styles from "./SyncPanel.module.css";

export default function SyncPanel({ syncCode, setSyncCode, isSyncing, onJoin }) {
  const [inputCode, setInputCode] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  if (!hasConfig) {
    return (
      <div className={styles.offlineBadge}>
        <span className={styles.dot} style={{ background: "#888" }} />
        Offline mode &mdash; data saved locally
      </div>
    );
  }

  const handleGenerate = () => {
    const code = generateSyncCode();
    setSyncCode(code);
  };

  const handleJoin = async () => {
    const code = inputCode.trim().toUpperCase();
    if (code.length < 4) return;
    const found = await onJoin(code);
    if (found) {
      setSyncCode(code);
      setInputCode("");
    } else {
      // No existing data — start fresh with this code
      setSyncCode(code);
      setInputCode("");
    }
  };

  const handleDisconnect = () => {
    setSyncCode("");
  };

  return (
    <div className={styles.section}>
      {isSyncing ? (
        <div className={styles.connected}>
          <div className={styles.statusRow}>
            <span className={styles.dot} style={{ background: "#1D9E75" }} />
            <span className={styles.statusText}>Syncing across devices</span>
          </div>
          <div className={styles.codeDisplay}>
            <span className={styles.codeLabel}>Your sync code</span>
            <span className={styles.code}>{syncCode}</span>
          </div>
          <div className={styles.hint}>
            Enter this code on another device to sync your data.
          </div>
          <ConfirmDeleteButton
            onConfirm={handleDisconnect}
            ariaLabel="Disconnect sync"
            className={styles.disconnectBtn}
          >
            Disconnect
          </ConfirmDeleteButton>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setShowPanel(!showPanel)}
            className={styles.toggleBtn}
          >
            <span className={styles.dot} style={{ background: "#EF9F27" }} />
            {showPanel ? "Hide sync options" : "Sync across devices"}
          </button>

          {showPanel && (
            <div className={styles.panel}>
              <div className={styles.option}>
                <div className={styles.optionTitle}>New — generate a sync code</div>
                <div className={styles.optionDesc}>Creates a unique code. Your current data will be uploaded.</div>
                <button type="button" onClick={handleGenerate} className={styles.actionBtn}>
                  Generate code
                </button>
              </div>
              <div className={styles.divider}>or</div>
              <div className={styles.option}>
                <div className={styles.optionTitle}>Join — enter an existing code</div>
                <div className={styles.optionDesc}>Sync with data from another device.</div>
                <div className={styles.joinRow}>
                  <input
                    type="text"
                    placeholder="e.g. A3K7BX9P"
                    className={styles.codeInput}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    maxLength={8}
                    aria-label="Sync code"
                  />
                  <button
                    type="button"
                    onClick={handleJoin}
                    className={styles.actionBtn}
                    disabled={inputCode.trim().length < 4}
                    style={{ opacity: inputCode.trim().length >= 4 ? 1 : 0.4 }}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
