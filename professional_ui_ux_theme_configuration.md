# Enterprise Loan ERP: Design System & Theme Configuration

To avoid the "basic AI-generated" look, a financial ERP needs a UI that instills trust, ensures high readability for data-heavy screens, and reduces eye strain for employees using it 8 hours a day. 

This theme relies on a "Corporate Slate & Trust Blue" aesthetic, utilizing subtle shadows, ample whitespace, and strict typography hierarchy.

## 1. Global CSS Variables (`global.css`)

Use these CSS Custom Properties as the foundation of your React application. This allows for easy implementation of Light/Dark modes in the future.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Backgrounds */
    --bg-app: #F8FAFC;       /* Very light slate for the main app background */
    --bg-surface: #FFFFFF;   /* Pure white for cards, sidebars, and modals */
    --bg-surface-hover: #F1F5F9;

    /* Text & Typography */
    --text-primary: #0F172A; /* Slate 900 - High contrast for readability */
    --text-secondary: #475569; /* Slate 600 - For labels and less important data */
    --text-tertiary: #94A3B8;  /* Slate 400 - For placeholders and disabled text */

    /* Primary Brand Colors (Trust Blue) */
    --brand-primary: #2563EB;   /* Deep Blue - Primary actions */
    --brand-primary-hover: #1D4ED8;
    --brand-primary-light: #EFF6FF; /* Background for active sidebar items */

    /* Semantic Colors (Financial Statuses) */
    --status-success: #10B981; /* Emerald - Paid, Approved */
    --status-success-bg: #D1FAE5;
    
    --status-warning: #F59E0B; /* Amber - Pending, Partial Payment */
    --status-warning-bg: #FEF3C7;
    
    --status-danger: #EF4444;  /* Red - Defaulted, Overdue, Rejected */
    --status-danger-bg: #FEE2E2;

    /* Borders & Dividers */
    --border-light: #E2E8F0;
    --border-strong: #CBD5E1;
  }

  body {
    background-color: var(--bg-app);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
}
```

## 2. Tailwind CSS Configuration (`tailwind.config.js`)

If you are using Tailwind in your React frontend, map the CSS variables to your Tailwind config. This keeps your React components clean and professional.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        app: 'var(--bg-app)',
        surface: 'var(--bg-surface)',
        brand: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--brand-primary-hover)',
          light: 'var(--brand-primary-light)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        border: 'var(--border-light)',
        success: 'var(--status-success)',
        warning: 'var(--status-warning)',
        danger: 'var(--status-danger)',
      },
      boxShadow: {
        /* Soft, premium shadows for cards instead of harsh standard shadows */
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Essential for professional form styling
  ],
}
```

## 3. Component Styling Guidelines (React Class Examples)

To ensure consistency across the ERP, use these pattern guidelines when building your React components:

### A. The "ERP Card" (Used for Dashboard Widgets & Forms)
Never use flat borders for core layout elements. Use the surface color with a soft shadow to create depth.
```jsx
// React / Tailwind Example
<div className="bg-surface rounded-xl shadow-card p-6 border border-border/50">
  <h3 className="text-text-primary font-semibold text-lg">Loan Overview</h3>
  {/* Card Content */}
</div>
```

### B. Primary Call-to-Action Buttons
Buttons should have a distinct hover state and smooth transition.
```jsx
<button className="bg-brand hover:bg-brand-hover text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm">
  Approve Loan
</button>
```

### C. Status Badges (Crucial for Loan States)
In an ERP, users scan for status. Use pill-shaped badges with soft backgrounds and bold text.
```jsx
{/* Approved Status */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-success-bg text-status-success">
  Active / Current
</span>

{/* Overdue Status */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-danger-bg text-status-danger">
  Overdue
</span>
```

### D. Data Tables (Ag-Grid / Custom Tables)
Financial tables should have very subtle borders and alternate row colors to help the eye track across long rows.
```jsx
<table className="min-w-full divide-y divide-border">
  <thead className="bg-bg-app">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
        Loan ID
      </th>
      {/* ... */}
    </tr>
  </thead>
  <tbody className="bg-surface divide-y divide-border">
    {/* Use hover:bg-bg-surface-hover for row interactions */}
    <tr className="hover:bg-bg-surface-hover transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">L-98432</td>
    </tr>
  </tbody>
</table>
```