export default function Logo({ className = '', dark = false }) {
  const textColor = dark ? 'text-white' : 'text-navy-800';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="9" fill="#0B2545" />
        <path d="M16 7L24 11V15C24 20.5 20.6 24.9 16 26C11.4 24.9 8 20.5 8 15V11L16 7Z" fill="#12967A" />
        <path d="M13 16L15.2 18.2L19.5 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-display font-semibold text-lg tracking-tight ${textColor}`}>
        Civic Connect
      </span>
    </div>
  );
}
