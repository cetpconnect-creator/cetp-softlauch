import React from 'react';
import Link from 'next/link';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'return-home', 'register'
  href,
  onClick,
  disabled = false,
  className = '',
  icon,
  type = 'button',
  ...props
}) {
  let baseClass = 'btn';
  if (variant === 'register') {
    baseClass = `register-btn ${disabled ? 'disabled' : ''}`;
  } else if (variant === 'return-home') {
    baseClass = 'return-home-btn';
  } else if (variant === 'outline') {
    baseClass = 'btn-outline';
  } else if (variant === 'secondary') {
    baseClass = 'btn-secondary';
  } else {
    baseClass = 'btn-primary';
  }

  const combinedClass = `${baseClass} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClass} {...props}>
        {icon && <span className="btn-icon">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
