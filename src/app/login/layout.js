import LanguageSelector from '@/components/shared/LanguageSelector'

export default function LoginLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* <LanguageSelector /> */}
      {children}
    </div>
  )
}