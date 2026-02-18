import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error }) => {
    if (!error) return null;

    return (
        <div className="flex items-start gap-2 mt-1 text-red-600 text-xs font-bold">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
        </div>
    );
};

export default ErrorMessage;
