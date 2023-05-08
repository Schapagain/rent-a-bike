import React from "react";

export default function Pill({ children }) {
    return (
        <div className="bg-green-400 px-3 overflow-hidden text-xs rounded-xl uppercase">
            {children}
        </div>
    );
}
