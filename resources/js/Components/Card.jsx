export default function Card({ children, className = '', hover = false, ...props }) {
    const baseClasses = 'bg-white rounded-xl shadow-soft p-6';
    const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-1' : '';
    
    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
            {children}
        </div>
    );
}

