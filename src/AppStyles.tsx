export const modelCard: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const paramsContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "8px",
};

export const paramItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 0",
};

export const editButton: React.CSSProperties = {
  alignSelf: "flex-end",
  padding: "6px 12px",
  backgroundColor: "#007bff",
  color: "#ffffff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export const modalActions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px",
};

export const saveButton: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#28a745",
  color: "#ffffff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export const cancelButton: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#dc3545",
  color: "#ffffff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
