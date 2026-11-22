import React from 'react';

// Shared header for interior pages so every page opens the same way.
const PageHeader = ({ title, intro, children }) => (
    <header className="page-header">
        <div className="container">
            <h1>{title}</h1>
            {intro && <p className="page-header-intro">{intro}</p>}
            {children}
        </div>
    </header>
);

export default PageHeader;
