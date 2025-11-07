import { Briefcase, MapPin, Trash2, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import Badge from './ui/Badge'
import type { Agent } from '@/types/agent'

interface AgentCardProps {
  agent: Agent
  onEdit?: (agent: Agent) => void
  onDelete?: (agent: Agent) => void
}

export default function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
  const { persona } = agent

  // Generate avatar color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500'
    ]
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const initials = persona.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card hoverable className="group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full ${getAvatarColor(
                persona.name
              )} flex items-center justify-center text-white font-semibold`}
            >
              {initials}
            </div>

            <div>
              <CardTitle>{persona.name}</CardTitle>
              {persona.age && (
                <p className="text-sm text-gray-500">Age {persona.age}</p>
              )}
            </div>
          </div>

          {/* Actions (visible on hover) */}
          <div className="opacity-0 group-hover:opacity-100 smooth-transition flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(agent)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg smooth-transition"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(agent)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg smooth-transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Occupation */}
        {persona.occupation && (
          <div className="flex items-start space-x-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{persona.occupation.title}</p>
              {persona.occupation.organization && (
                <p className="text-gray-600">{persona.occupation.organization}</p>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {(persona.residence || persona.nationality) && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>
              {persona.residence && persona.nationality
                ? `${persona.residence}, ${persona.nationality}`
                : persona.residence || persona.nationality}
            </span>
          </div>
        )}

        {/* Personality Traits */}
        {persona.personality && persona.personality.traits && persona.personality.traits.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-medium text-gray-500 mb-2">Personality</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {persona.personality.traits[0]}
            </p>
          </div>
        )}

        {/* Interests */}
        {persona.preferences?.interests && persona.preferences.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {persona.preferences.interests.slice(0, 3).map((interest, idx) => (
              <Badge key={idx} variant="default" className="text-xs">
                {interest}
              </Badge>
            ))}
            {persona.preferences.interests.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{persona.preferences.interests.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
