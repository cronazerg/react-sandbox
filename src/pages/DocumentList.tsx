import React from 'react';
import IconComponent from '../components/IconComponent';

const DocumentList: React.FC = () => {
  return (
    <>
      <h1>Document List</h1>
      <IconComponent name="home" size={24} color="#1e40af" />
      <IconComponent name="user" size={32} color="#047857" />
      <IconComponent name="settings" size={28} color="#7c3aed" />
    </>
  );
};

export default DocumentList;
