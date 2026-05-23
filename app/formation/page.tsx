'use client'
import { MainLayout } from '@/components/MainLayout'
import { Card, CardHeader, StatCard, Badge, ProgressBar } from '@/components/UI'
import { BookOpen, Award, Clock, CheckCircle } from 'lucide-react'

const mockUser = { full_name: 'Jose Reyes', role: 'Head Server', avatar_initials: 'JR' }

const formationMaterials = [
  {
    id: '1',
    title: 'Vestment Guide',
    description: 'Comprehensive guide to proper ecclesiastical vestments',
    progress: 100,
    completed: '2 weeks ago',
    pages: 45,
    duration: '3 hours',
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Roman Rite Basics',
    description: 'Introduction to the Traditional Latin Mass',
    progress: 85,
    completed: 'In progress',
    pages: 120,
    duration: '8 hours',
    status: 'in-progress' as const,
  },
  {
    id: '3',
    title: 'Sacred Movements',
    description: 'Proper posture and movement during liturgy',
    progress: 60,
    completed: 'In progress',
    pages: 35,
    duration: '2 hours',
    status: 'in-progress' as const,
  },
  {
    id: '4',
    title: 'Prayers & Responses',
    description: 'Essential liturgical prayers and responses',
    progress: 45,
    completed: 'Not started',
    pages: 78,
    duration: '5 hours',
    status: 'not-started' as const,
  },
  {
    id: '5',
    title: 'Holy Week Procedures',
    description: 'Special protocols for Holy Week services',
    progress: 0,
    completed: 'Not started',
    pages: 55,
    duration: '3.5 hours',
    status: 'not-started' as const,
  },
  {
    id: '6',
    title: 'Sacramental Principles',
    description: 'Theological foundations of sacraments',
    progress: 100,
    completed: '1 month ago',
    pages: 95,
    duration: '6 hours',
    status: 'completed' as const,
  },
]

const certifications = [
  { name: 'Server Basics', earnedDate: '2025-06-15', level: 'Foundation' },
  { name: 'Advanced Liturgy', earnedDate: '2025-09-20', level: 'Intermediate' },
  { name: 'Holy Week Specialist', earnedDate: '2025-12-10', level: 'Advanced' },
]

export default function Formation() {
  const completedCount = formationMaterials.filter(m => m.status === 'completed').length
  const inProgressCount = formationMaterials.filter(m => m.status === 'in-progress').length
  const avgProgress = Math.round(formationMaterials.reduce((sum, m) => sum + m.progress, 0) / formationMaterials.length)

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Completed Materials" value={completedCount} sub={`${completedCount}/${formationMaterials.length} done`} badge={{ text: 'Completed', color: 'green' as const }} />
          <StatCard label="In Progress" value={inProgressCount} sub="actively learning" badge={{ text: 'In progress', color: 'amber' as const }} />
          <StatCard label="Average Progress" value={`${avgProgress}%`} sub="all materials" badge={{ text: 'Progress', color: 'green' as const }} />
          <StatCard label="Certifications" value={certifications.length} sub="earned" badge={{ text: 'Earned', color: 'green' as const }} />
        </div>

        {/* Learning Materials Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#f5f0e8] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#c9a227]" />
            Learning Library
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {formationMaterials.map((material) => (
              <Card key={material.id}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#f5f0e8]">{material.title}</h4>
                    <p className="text-xs text-[#b8ada0]">{material.description}</p>
                  </div>
                  <Badge
                    label={material.status === 'completed' ? 'Complete' : material.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                    color={material.status === 'completed' ? 'green' : material.status === 'in-progress' ? 'amber' : 'gray'}
                  />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#b8ada0]">Progress</span>
                    <span className="text-xs font-semibold text-[#f5f0e8]">{material.progress}%</span>
                  </div>
                  <ProgressBar label={`${material.name} progress`} value={material.progress} color={material.status === 'completed' ? 'green' : 'gold'} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-[#b8ada0] pb-3 border-b border-[#2a1010]">
                  <div>
                    <p className="text-[#c9a227] font-semibold">{material.pages}</p>
                    <p>pages</p>
                  </div>
                  <div>
                    <p className="text-[#c9a227] font-semibold">{material.duration}</p>
                    <p>duration</p>
                  </div>
                  <div>
                    <p className="text-[#c9a227] font-semibold">{material.completed}</p>
                    <p>status</p>
                  </div>
                </div>

                <button className={`w-full mt-2 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  material.status === 'completed'
                    ? 'bg-[#2a3a2a] text-[#3a9a4a]'
                    : 'bg-[#c9a227] text-[#1a0808] hover:bg-[#b89a1f]'
                }`}>
                  {material.status === 'completed' ? 'Review' : material.status === 'in-progress' ? 'Continue' : 'Start Now'}
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <Card>
          <CardHeader
            title="Earned Certifications"
            link={{ label: 'View all' }}
            icon={<Award className="w-3.5 h-3.5 text-[#c9a227]" />}
          />
          <div className="space-y-2">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border border-[#3a2020] rounded hover:border-[#c9a227]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#3a9a4a]" />
                  <div>
                    <p className="font-semibold text-[#f5f0e8]">{cert.name}</p>
                    <p className="text-xs text-[#b8ada0]">{cert.level}</p>
                  </div>
                </div>
                <span className="text-xs text-[#b8ada0]">{new Date(cert.earnedDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
