'use client'

import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, Badge } from '@/components/UI'
import { BookOpen, FileText, Play, Download } from 'lucide-react'

const mockUser = { id: '1', full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR', email: 'jose.reyes@example.com' }

const formations = [
  { id: 1, title: 'Vestment guide', type: 'pdf', size: '2.4 MB', completed: true, icon: FileText },
  { id: 2, title: 'Mass of the Roman Rite — introduction', type: 'video', duration: '18 min', completed: true, icon: Play },
  { id: 3, title: 'Server prayers booklet', type: 'pdf', size: '1.1 MB', completed: false, icon: FileText },
  { id: 4, title: 'Holy Week procedures', type: 'pdf', size: '3.8 MB', completed: false, icon: FileText },
  { id: 5, title: 'Advanced techniques for servers', type: 'video', duration: '25 min', completed: false, icon: Play },
]

export default function Formation() {
  const completedCount = formations.filter(f => f.completed).length
  const progress = Math.round((completedCount / formations.length) * 100)

  return (
    <MainLayout user={mockUser}>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#f5f0e8] mb-2">Formation Materials</h2>
          <p className="text-sm text-[#8a6070]">Learn and master your role as a server</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#e8dcc8] mb-2">Your Progress</div>
              <div className="text-xs text-[#8a6070]">{completedCount} of {formations.length} modules completed</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#c9a227]">{progress}%</div>
              <Badge text="In Progress" color="amber" />
            </div>
          </div>
          <div className="h-2 bg-[#3a1a1a] rounded-full overflow-hidden mt-4">
            <div className="h-full bg-[#c9a227] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </Card>

        {/* Materials List */}
        <Card>
          <CardHeader title="Available Materials" icon={<BookOpen className="w-4 h-4 text-[#c9a227]" />} />
          <div className="space-y-3">
            {formations.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#1a0808] rounded-lg border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(201,162,39,0.1)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#c9a227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#e8dcc8] font-medium">{item.title}</div>
                      <div className="text-xs text-[#6a5060]">{item.type === 'pdf' ? `PDF · ${item.size}` : `Video · ${item.duration}`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.completed && <Badge text="Completed" color="green" />}
                    <button className="p-2 hover:bg-[rgba(201,162,39,0.1)] rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-[#c9a227]" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
