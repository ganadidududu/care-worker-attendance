/**
 * 큰 터치 영역 버튼 컴포넌트
 * 고령 사용자를 위한 최소 64px 높이
 */
export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const variants = {
    primary: 'btn-primary',
    success: 'bg-success-500 text-white hover:bg-success-600 btn-large',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 btn-large',
    secondary: 'btn-secondary',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
