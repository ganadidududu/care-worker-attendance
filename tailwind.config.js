/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'base': '18px',      // 기본 텍스트
        'lg': '20px',        // 큰 텍스트
        'xl': '24px',        // 버튼 텍스트
        '2xl': '28px',       // 헤더
        '3xl': '32px',       // 큰 숫자/시간
        '4xl': '40px',       // 메인 헤딩
        '5xl': '48px',       // 특별한 강조
      },
      minHeight: {
        'button': '64px',    // 최소 버튼 높이
        'input': '56px',     // 최소 입력 필드 높이
        'touch': '48px',     // 최소 터치 영역
      },
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        success: {
          500: '#10B981',
          600: '#059669',
        },
        danger: {
          500: '#EF4444',
          600: '#DC2626',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      borderRadius: {
        'button': '12px',
        'card': '16px',
      }
    },
  },
  plugins: [],
}
