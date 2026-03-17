import React from 'react';

export default function Shape({ className = "" }: { className?: string }) {
    return (
        <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="100" height="100" fill="#0B2D72" />
        </svg>
    );
}
