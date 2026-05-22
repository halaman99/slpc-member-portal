'use client'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#2a1010] rounded-xl p-4 border border-[rgba(201,162,39,0.15)] ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, link, icon }: { title: string; link?: { label: string; href?: string }; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium text-[#e8dcc8]">{title}</h3>
      </div>
      {link && (
        <a href={link.href} className="text-xs text-[#c9a227] hover:text-[#dbb237] cursor-pointer">
          {link.label}
        </a>
      )}
    </div>
  )
}

export function StatCard({ label, value, sub, badge, icon }: { label: string; value: string | number; sub?: string; badge?: { text: string; color: 'green' | 'amber' | 'red' }; icon?: React.ReactNode }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-xs text-[#8a6070]">{label}</span>
        {badge && (
          <span
            className={`text-xs ml-auto py-0.5 px-1.5 rounded-full ${
              badge.color === 'green'
                ? 'bg-[#0f3a1a] text-[#4a9a5a]'
                : badge.color === 'amber'
                  ? 'bg-[#3a2a0a] text-[#c9a227]'
                  : 'bg-[#3a0a0a] text-[#c95a5a]'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div className="text-2xl font-medium text-[#f5f0e8] mb-1">{value}</div>
      {sub && <div className="text-xs text-[#6a5060]">{sub}</div>}
    </Card>
  )
}

export function Badge({ text, color }: { text: string; color: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'teal' }) {
  const colors = {
    green: 'bg-[#0a2a0a] text-[#4a9a4a]',
    amber: 'bg-[#2a1a0a] text-[#c9a227]',
    red: 'bg-[#2a0a0a] text-[#c95a5a]',
    blue: 'bg-[#0a1a2a] text-[#5a8ac9]',
    purple: 'bg-[#1a0a2a] text-[#9a5ac9]',
    teal: 'bg-[#0a2a1a] text-[#4a9a6a]',
  }
  return <span className={`text-xs px-2 py-1 rounded-lg border border-opacity-50 ${colors[color]}`}>{text}</span>
}

export function ProgressBar({ label, value, color = 'gold' }: { label: string; value: number; color?: 'gold' | 'green' | 'red' }) {
  const colorClasses = {
    gold: 'bg-[#c9a227]',
    green: 'bg-[#3a9a4a]',
    red: 'bg-[#c95a5a]',
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[#c8b8a0]">{label}</span>
        <span className="text-xs text-[#c9a227] font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-[#3a1a1a] rounded-full overflow-hidden">
        <div className={`h-full ${colorClasses[color]} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
