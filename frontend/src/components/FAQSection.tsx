"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQItemProps {
  question: string;
  answer: string;
  className?: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '1.5rem',
          background: 'rgba(102, 126, 234, 0.05)',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          color: '#2d3748',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          textAlign: 'left',
          borderRadius: isOpen ? '12px 12px 0 0' : '12px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
        }}
      >
        <span>{question}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      
      {isOpen && (
        <div 
          style={{
            padding: '1.5rem',
            color: '#718096',
            borderTop: '1px solid rgba(102, 126, 234, 0.1)',
            background: 'white',
            borderRadius: '0 0 12px 12px',
            animation: 'fadeInDown 0.3s ease-out',
          }}
        >
          {answer}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

interface FAQSectionProps {
  faqItems: Array<{ question: string; answer: string }>;
  itemClassName?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqItems, itemClassName = "" }) => {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {faqItems.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          className={itemClassName}
        />
      ))}
    </div>
  );
};

export default FAQSection;
