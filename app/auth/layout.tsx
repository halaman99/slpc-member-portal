export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#1a0808] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-8 bg-[#c9a227] rounded mr-1"></div>
                <div className="w-8 h-1 bg-[#c9a227] rounded"></div>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-[#f5f0e8]">Member Portal</h1>
          </div>
          <p className="text-xs text-[#8a6070]">St. Lodovico Pavoni</p>
        </div>

        {/* Content */}
        <div className="bg-[#2a1010] rounded-lg border border-[rgba(201,162,39,0.15)] p-6 md:p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#6a5060]">
          <p>© 2026 St. Lodovico Pavoni. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
