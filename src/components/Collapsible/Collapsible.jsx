// Collapsible.jsx
import { useState } from "react";

export default function Collapsible({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="collapsible-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="collapsible-button"
            >
                {isOpen ? "Hide" : "Show"} {title}
            </button>
            {isOpen && <div className="collapsible-content">{children}</div>}
        </div>
    );
}
