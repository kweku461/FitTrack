import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function RowActions({ label, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  const confirmDelete = async () => {
    await onDelete();
    setConfirming(false);
  };

  return (
    <div className="history-actions">
      {confirming ? (
        <>
          <span className="history-confirm-text">Delete?</span>
          <button
            type="button"
            className="history-btn history-btn-danger"
            onClick={confirmDelete}
          >
            Yes
          </button>
          <button type="button" className="history-btn" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="history-icon-btn"
            aria-label={`Edit ${label}`}
            onClick={onEdit}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="history-icon-btn history-icon-danger"
            aria-label={`Delete ${label}`}
            onClick={() => setConfirming(true)}
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export default RowActions;