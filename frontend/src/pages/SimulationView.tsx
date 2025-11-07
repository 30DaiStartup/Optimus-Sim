import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Clock, CheckCircle, XCircle, Download, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/Spinner'
import { useSimulation, useSimulationStatus } from '@/hooks/useSimulations'
import { SimulationStatus } from '@/types/simulation'

export default function SimulationView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: simulation, isLoading, isError } = useSimulation(id!)
  const { data: status } = useSimulationStatus(id!, simulation?.status === SimulationStatus.RUNNING)

  if (isLoading) {
    return <LoadingState message="Loading simulation..." />
  }

  if (isError || !simulation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load simulation. It may not exist.</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const statusConfig = {
    pending: { label: 'Pending', variant: 'default' as const, icon: Clock, color: 'text-gray-600' },
    running: { label: 'Running', variant: 'warning' as const, icon: Play, color: 'text-yellow-600' },
    completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle, color: 'text-green-600' },
    failed: { label: 'Failed', variant: 'danger' as const, icon: XCircle, color: 'text-red-600' },
  }

  const config = statusConfig[simulation.status]
  const StatusIcon = config.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExport = () => {
    if (!simulation.result) return

    const dataStr = JSON.stringify(simulation.result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `simulation-${simulation.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{simulation.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={config.variant}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
              <span className="text-sm text-gray-500">
                Created {formatDate(simulation.created_at)}
              </span>
            </div>
          </div>
          {simulation.result && (
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>

        {/* Progress (for running simulations) */}
        {simulation.status === SimulationStatus.RUNNING && status && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {status.current_step || 0} / {status.total_steps || simulation.config.steps}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full smooth-transition"
                  style={{ width: `${status.progress || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Simulation is running... This may take a few minutes.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Config Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Environment</p>
                <p className="text-gray-900 capitalize">
                  {simulation.config.environment_type.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Steps</p>
                <p className="text-gray-900">{simulation.config.steps}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Initial Prompt</p>
                <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">
                  {simulation.config.initial_prompt}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Users className="w-4 h-4 inline mr-2" />
                Agents ({simulation.agent_ids.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {simulation.agent_ids.map((agentId) => (
                  <div
                    key={agentId}
                    className="p-2 bg-gray-50 rounded text-sm text-gray-700 font-mono"
                  >
                    {agentId.slice(0, 8)}...
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {simulation.status === SimulationStatus.COMPLETED && simulation.result && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {simulation.result.interactions && simulation.result.interactions.length > 0 ? (
                <div className="space-y-4">
                  {simulation.result.interactions.map((interaction, idx) => (
                    <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{interaction.agent_name}</span>
                        <Badge variant="default" className="text-xs">{interaction.message_type}</Badge>
                        <span className="text-xs text-gray-500">{new Date(interaction.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{interaction.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">{simulation.result.summary || 'Simulation completed but no interactions were recorded.'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {simulation.status === SimulationStatus.FAILED && simulation.error && (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-red-900 mb-2">Simulation Failed</p>
                <p className="text-red-800 text-sm">{simulation.error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Message */}
        {simulation.status === SimulationStatus.PENDING && (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-700">This simulation hasn't been started yet.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
