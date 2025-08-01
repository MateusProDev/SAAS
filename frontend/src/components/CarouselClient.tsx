"use client";
import React from "react";

// Componente de carrossel super simples - apenas um grid responsivo
const CarouselClient: React.FC<{ children: React.ReactNode[] }> = ({ children }) => {
  return (
    <div className="simple-templates-grid">
      {children}
    </div>
  );
};

export default CarouselClient;
