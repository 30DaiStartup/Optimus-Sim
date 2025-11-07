import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import { LoadingState, EmptyState } from '@/components/ui/Spinner'
import AgentCard from '@/components/AgentCard'
import CreateAgentModal from '@/components/CreateAgentModal'
import { useAgents, useDeleteAgent } from '@/hooks/useAgents'
import type { Agent } from '@/types/agent'

export default function AgentLibrary() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, isLoading, isError } = useAgents()
  const deleteAgent = useDeleteAgent()

  const handleDelete = async (agent: Agent) => {
    if (window.confirm(`Are you sure you want to delete ${agent.persona.name}?`)) {
      try {
        await deleteAgent.mutateAsync(agent.id)
      } catch (error) {
        console.error('Failed to delete agent:', error)
        alert('Failed to delete agent. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Library</h1>
            <p className="text-gray-600 mt-1">
              Manage your AI personas and create new agents
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Agent
          </Button>
        </div>

        {/* Content */}
        {isLoading && <LoadingState message="Loading agents..." />}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Failed to load agents. Please try again.</p>
          </div>
        )}

        {data && data.agents.length === 0 && (
          <EmptyState
            icon={Users}
            title="No agents yet"
            description="Create your first agent to start running simulations. You can generate one with AI, upload a JSON file, or build from scratch."
            action={
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            }
          />
        )}

        {data && data.agents.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {data.total} {data.total === 1 ? 'agent' : 'agents'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onEdit={(agent) => {
                    // TODO: Implement edit modal
                    alert(`Edit functionality for ${agent.persona.name} coming soon!`)
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
