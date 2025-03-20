import React from 'react';

const Field = ({ label, value, isEditing, onChange }) => {
  return (
    <div className="field-container">
      <div className="field-label">{label}</div>
      {isEditing ? (
        <textarea value={value} onChange={onChange} />
      ) : (
        <div className="field-content">{value || 'No data available'}</div>
      )}
    </div>
  );
};

export default Field;
