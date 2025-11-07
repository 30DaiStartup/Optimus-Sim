import { useState } from 'react'
import { Sparkles, Users, Play, Plus, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { LoadingState, EmptyState } from '@/components/ui/Spinner'
import SimulationCard from '@/components/SimulationCard'
import CreateSimulationModal from '@/components/CreateSimulationModal'
import { useSimulations, useDeleteSimulation } from '@/hooks/useSimulations'
import { useAgents } from '@/hooks/useAgents'
import type { Simulation } from '@/types/simulation'

export default function Dashboard() {
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data: simulationsData, isLoading: simulationsLoading } = useSimulations()
  const { data: agentsData } = useAgents()
  const deleteSimulation = useDeleteSimulation()

  const recentSimulations = simulationsData?.simulations.slice(0, 6) || []
  const agentCount = agentsData?.total || 0

  const handleDelete = async (simulation: Simulation) => {
    if (window.confirm(`Are you sure you want to delete "${simulation.name}"?`)) {
      try {
        await deleteSimulation.mutateAsync(simulation.id)
      } catch (error) {
        console.error('Failed to delete simulation:', error)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to OptimusSim
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and run AI-powered persona simulations to gain insights,
            test ideas, and explore human behavior.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/agents')}>
            <Users className="w-4 h-4 mr-2" />
            Manage Agents
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Play className="w-4 h-4 mr-2" />
            New Simulation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl card-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{agentCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl card-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Simulations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {simulationsData?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl card-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {simulationsData?.simulations.filter(s => s.status === 'completed').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Simulations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recent Simulations</h2>
            {recentSimulations.length > 0 && (
              <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Simulation
              </Button>
            )}
          </div>

          {simulationsLoading && <LoadingState message="Loading simulations..." />}

          {!simulationsLoading && recentSimulations.length === 0 && (
            <EmptyState
              icon={Play}
              title="No simulations yet"
              description="Create your first simulation to see AI agents interact and generate insights."
              action={
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Play className="w-4 h-4 mr-2" />
                  Create Your First Simulation
                </Button>
              }
            />
          )}

          {!simulationsLoading && recentSimulations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSimulations.map((simulation) => (
                <SimulationCard
                  key={simulation.id}
                  simulation={simulation}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Simulation Modal */}
      <CreateSimulationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
