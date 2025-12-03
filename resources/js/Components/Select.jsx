export default function Select({ 
    label, 
    error, 
    className = '', 
    id,
    children,
    ...props 
}) {
    const inputId = id || props.name;
    
    return (
        <div className="mb-4">
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {props.required && <span className="text-danger-500 ml-1" aria-label="required">*</span>}
                </label>
            )}
            <select
                id={inputId}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={`
                    w-full px-4 py-2.5 rounded-lg border 
                    ${error 
                        ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' 
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }
                    focus:ring-2 focus:outline-none transition-colors
                    bg-white
                    ${className}
                `}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p id={`${inputId}-error`} className="mt-1 text-sm text-danger-600" role="alert">{error}</p>
            )}
        </div>
    );
}

