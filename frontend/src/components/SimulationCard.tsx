import { Play, Clock, CheckCircle, XCircle, Users, Eye, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import type { Simulation, SimulationStatus } from '@/types/simulation'

interface SimulationCardProps {
  simulation: Simulation
  onDelete?: (simulation: Simulation) => void
}

const statusConfig: Record<SimulationStatus, { label: string; variant: 'default' | 'warning' | 'success' | 'danger'; icon: any }> = {
  pending: { label: 'Pending', variant: 'default', icon: Clock },
  running: { label: 'Running', variant: 'warning', icon: Play },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
  failed: { label: 'Failed', variant: 'danger', icon: XCircle },
}

export default function SimulationCard({ simulation, onDelete }: SimulationCardProps) {
  const navigate = useNavigate()
  const config = statusConfig[simulation.status]
  const StatusIcon = config.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card hoverable onClick={() => navigate(`/simulations/${simulation.id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{simulation.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={config.variant}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatDate(simulation.created_at)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Agent count */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{simulation.agent_ids.length} agents</span>
        </div>

        {/* Initial prompt preview */}
        <div className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded">
          {simulation.config.initial_prompt}
        </div>

        {/* Config details */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{simulation.config.steps} steps</span>
          <span>•</span>
          <span>{simulation.config.environment_type.replace('_', ' ')}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/simulations/${simulation.id}`)
          }}
        >
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </Button>

        {onDelete && (
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(simulation)
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
