/**
 * 큰 입력 필드 컴포넌트
 * 고령 사용자를 위한 큰 폰트와 명확한 라벨
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-lg font-semibold mb-2">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-large w-full ${error ? 'border-danger-500 focus:border-danger-500' : ''}`}
        {...props}
      />
      {error && <p className="text-danger-500 text-base mt-2">{error}</p>}
    </div>
  );
}
