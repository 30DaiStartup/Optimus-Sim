import { useState } from 'react'
import { Check } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import { cn } from '@/lib/cn'
import { useAgents } from '@/hooks/useAgents'
import { useCreateSimulation, useStartSimulation } from '@/hooks/useSimulations'
import { EnvironmentType } from '@/types/simulation'

interface CreateSimulationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateSimulationModal({ isOpen, onClose }: CreateSimulationModalProps) {
  const [name, setName] = useState('')
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([])
  const [environmentType, setEnvironmentType] = useState<EnvironmentType>(EnvironmentType.CHAT_ROOM)
  const [initialPrompt, setInitialPrompt] = useState('')
  const [steps, setSteps] = useState(5)

  const { data: agentsData } = useAgents()
  const createSimulation = useCreateSimulation()
  const startSimulation = useStartSimulation()

  const agents = agentsData?.agents || []

  const toggleAgent = (agentId: string) => {
    setSelectedAgentIds(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const handleCreate = async () => {
    if (!name.trim() || selectedAgentIds.length === 0 || !initialPrompt.trim()) {
      alert('Please fill in all required fields and select at least one agent')
      return
    }

    try {
      const simulation = await createSimulation.mutateAsync({
        name: name.trim(),
        agent_ids: selectedAgentIds,
        config: {
          steps,
          initial_prompt: initialPrompt.trim(),
          environment_type: environmentType,
          parallel_actions: true,
          cache_enabled: false
        }
      })

      // Automatically start the simulation
      await startSimulation.mutateAsync(simulation.id)

      onClose()
      resetForm()
    } catch (error) {
      console.error('Failed to create simulation:', error)
      alert('Failed to create simulation. Please try again.')
    }
  }

  const resetForm = () => {
    setName('')
    setSelectedAgentIds([])
    setEnvironmentType(EnvironmentType.CHAT_ROOM)
    setInitialPrompt('')
    setSteps(5)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const isValid = name.trim() && selectedAgentIds.length > 0 && initialPrompt.trim()

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Simulation"
      description="Setup and run a multiagent simulation"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            isLoading={createSimulation.isPending || startSimulation.isPending}
            disabled={!isValid}
          >
            Create & Run
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Simulation Name */}
        <Input
          label="Simulation Name"
          placeholder="E.g., Product Brainstorming Session"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText="Give your simulation a descriptive name"
        />

        {/* Select Agents */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Agents (minimum 1)
          </label>
          {agents.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              No agents available. Please create agents first.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    'p-3 border-2 rounded-lg cursor-pointer smooth-transition',
                    selectedAgentIds.includes(agent.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{agent.persona.name}</p>
                      {agent.persona.occupation && (
                        <p className="text-sm text-gray-600">{agent.persona.occupation.title}</p>
                      )}
                    </div>
                    {selectedAgentIds.includes(agent.id) && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {selectedAgentIds.length} agent{selectedAgentIds.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Environment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(EnvironmentType).map((type) => (
              <button
                key={type}
                onClick={() => setEnvironmentType(type)}
                className={cn(
                  'p-3 border-2 rounded-lg text-left smooth-transition',
                  environmentType === type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <p className="font-medium text-sm text-gray-900 capitalize">
                  {type.replace('_', ' ')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Initial Prompt */}
        <Textarea
          label="Initial Prompt"
          placeholder="E.g., Discuss ideas for improving our product's user experience"
          value={initialPrompt}
          onChange={(e) => setInitialPrompt(e.target.value)}
          rows={4}
          helperText="What should the agents discuss or work on?"
        />

        {/* Steps */}
        <div>
          <Input
            label="Number of Steps"
            type="number"
            min={1}
            max={50}
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value) || 5)}
            helperText="How many interaction rounds should the simulation run?"
          />
        </div>
      </div>
    </Modal>
  )
}
