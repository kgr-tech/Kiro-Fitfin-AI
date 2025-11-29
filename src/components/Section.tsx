// Section Component - Reusable wrapper for dashboard sections
// Provides consistent styling and structure

import React from 'react';
import { SectionProps } from '../types/components';

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section 
      className={`bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border ${className}`}
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <h2 
        id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4"
      >
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
