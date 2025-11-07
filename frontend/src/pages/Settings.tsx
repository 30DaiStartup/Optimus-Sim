import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Server, Key } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/Spinner'

export default function Settings() {
  const { data: apiStatus, isLoading } = useQuery({
    queryKey: ['api-status'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/')
      return response.json()
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure and monitor your OptimusSim instance</p>
        </div>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Server className="w-5 h-5 inline mr-2" />
              API Status
            </CardTitle>
            <CardDescription>
              Connection status to the OptimusSim backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Checking API status..." />
            ) : apiStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Backend Connected</p>
                      <p className="text-sm text-green-700">
                        {apiStatus.name} v{apiStatus.version}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="font-medium text-gray-900 capitalize">{apiStatus.status}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">API Type</p>
                    <p className="font-medium text-gray-900 uppercase">{apiStatus.api_type}</p>
                  </div>
                </div>

                {apiStatus.api_configured !== undefined && (
                  <div className={`p-4 border rounded-lg ${
                    apiStatus.api_configured
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {apiStatus.api_configured ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          apiStatus.api_configured ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          {apiStatus.api_configured ? 'API Keys Configured' : 'API Keys Not Configured'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          apiStatus.api_configured ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          {apiStatus.api_configured
                            ? 'Your API keys are properly configured and ready to use.'
                            : 'Please configure your API keys in the .env file to use TinyTroupe.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Backend Disconnected</p>
                    <p className="text-sm text-red-700">
                      Unable to connect to the backend. Make sure it's running.
                    </p>
                  </div>
                </div>
                <Badge variant="danger">Offline</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Guide */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Key className="w-5 h-5 inline mr-2" />
              API Configuration
            </CardTitle>
            <CardDescription>
              How to configure your API keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">1. Setup Environment Variables</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Copy <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> to <code className="bg-gray-100 px-2 py-1 rounded">.env</code> in the OptimusSim directory
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">2. Add Your API Key</h3>
                <p className="text-sm text-gray-600 mb-2">
                  For OpenAI:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                  OPENAI_API_KEY=sk-your-api-key-here
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. Restart the Backend</h3>
                <p className="text-sm text-gray-600">
                  Restart the backend server for changes to take effect
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Never commit your .env file to version control.
                  It's already in .gitignore for your safety.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Links */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 smooth-transition"
              >
                <p className="font-medium text-primary-600">API Documentation →</p>
                <p className="text-sm text-gray-600">Interactive API docs (FastAPI)</p>
              </a>

              <a
                href="https://github.com/microsoft/TinyTroupe"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 smooth-transition"
              >
                <p className="font-medium text-primary-600">TinyTroupe GitHub →</p>
                <p className="text-sm text-gray-600">Source code and documentation</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
