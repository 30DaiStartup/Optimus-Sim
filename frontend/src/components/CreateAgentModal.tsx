import { useState } from 'react'
import { Sparkles, Upload, FileText, Pen } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import { useGenerateAgent, useUploadAgent } from '@/hooks/useAgents'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

type CreationMethod = 'quick' | 'upload' | 'scratch' | null

export default function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const [method, setMethod] = useState<CreationMethod>(null)
  const [description, setDescription] = useState('')
  const [context, setContext] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const generateAgent = useGenerateAgent()
  const uploadAgent = useUploadAgent()

  const handleGenerate = async () => {
    if (!description.trim()) return

    try {
      await generateAgent.mutateAsync({
        description: description.trim(),
        context: context.trim() || undefined
      })
      onClose()
      resetForm()
    } catch (error) {
      console.error('Failed to generate agent:', error)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      await uploadAgent.mutateAsync(file)
      onClose()
      resetForm()
    } catch (error) {
      console.error('Failed to upload agent:', error)
    }
  }

  const handleManualCreate = async () => {
    // This would open a full form - for now, show a message
    alert('Manual agent creation form coming soon!')
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setMethod(null)
    setDescription('')
    setContext('')
    setFile(null)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!method) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create New Agent"
        description="Choose how you'd like to create your agent"
        size="md"
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Quick Generate */}
          <button
            onClick={() => setMethod('quick')}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 smooth-transition text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-lg flex items-center justify-center smooth-transition">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Quick Generate with AI</h3>
                <p className="text-sm text-gray-600">
                  Describe your agent in natural language and let AI create the detailed persona
                </p>
              </div>
            </div>
          </button>

          {/* Upload JSON */}
          <button
            onClick={() => setMethod('upload')}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 smooth-transition text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center smooth-transition">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Upload Agent File</h3>
                <p className="text-sm text-gray-600">
                  Import an existing TinyPerson JSON specification
                </p>
              </div>
            </div>
          </button>

          {/* Build from Scratch */}
          <button
            onClick={() => setMethod('scratch')}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 smooth-transition text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center smooth-transition">
                <Pen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Build from Scratch</h3>
                <p className="text-sm text-gray-600">
                  Manually define all persona details with full control
                </p>
              </div>
            </div>
          </button>
        </div>
      </Modal>
    )
  }

  if (method === 'quick') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Generate Agent with AI"
        description="Describe the agent you want to create"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setMethod(null)}>
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              isLoading={generateAgent.isPending}
              disabled={!description.trim()}
            >
              Generate Agent
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea
            label="Agent Description"
            placeholder="E.g., A 35-year-old software engineer who loves coffee, coding in Python, and hiking on weekends. Works at a tech startup and is passionate about AI."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            helperText="Describe the agent's role, personality, interests, and background"
          />

          <Input
            label="Context (Optional)"
            placeholder="E.g., A modern tech company in San Francisco"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            helperText="Provide context about where this agent exists"
          />

          {generateAgent.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              Failed to generate agent. Please try again.
            </div>
          )}
        </div>
      </Modal>
    )
  }

  if (method === 'upload') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Upload Agent File"
        description="Upload a TinyPerson JSON specification"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setMethod(null)}>
              Back
            </Button>
            <Button
              onClick={handleUpload}
              isLoading={uploadAgent.isPending}
              disabled={!file}
            >
              Upload Agent
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select JSON File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 smooth-transition">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">JSON files only</p>
              </label>
            </div>
          </div>

          {uploadAgent.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              Failed to upload agent. Please check the file format.
            </div>
          )}
        </div>
      </Modal>
    )
  }

  if (method === 'scratch') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Build Agent from Scratch"
        description="Manual agent creation coming soon"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setMethod(null)}>
              Back
            </Button>
            <Button onClick={handleManualCreate}>
              Create Agent
            </Button>
          </>
        }
      >
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Full manual agent creation form will be available soon.
            For now, use Quick Generate or upload a JSON file.
          </p>
        </div>
      </Modal>
    )
  }

  return null
}
