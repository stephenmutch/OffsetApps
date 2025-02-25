import React, { useState } from 'react';
import { useApi } from '@/lib/api/hooks';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface Endpoint {
  name: string;
  path: string;
  method: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
}

const ENDPOINTS: Endpoint[] = [
  {
    name: 'Get All Groups',
    path: '/groups',
    method: 'GET',
    description: 'Get a list of all available groups',
    parameters: []
  },
  {
    name: 'Get Group',
    path: '/groups/{id}',
    method: 'GET',
    description: 'Get details for a specific group',
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Group ID'
      }
    ]
  },
  {
    name: 'Get All Clubs',
    path: '/clubs',
    method: 'GET',
    description: 'Get a list of all available clubs',
    parameters: []
  },
  {
    name: 'Get Club',
    path: '/clubs/{id}',
    method: 'GET',
    description: 'Get details for a specific club',
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Club ID'
      }
    ]
  },
  {
    name: 'Get Customer',
    path: '/customers/{id}',
    method: 'GET',
    description: 'Get details for a specific customer',
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Customer ID'
      }
    ]
  },
  {
    name: 'Get Customers by Signup Date',
    path: '/customers/created/{start}/{end}/{limit}/{page}',
    method: 'GET',
    description: 'Get customers filtered by signup date',
    parameters: [
      {
        name: 'start',
        type: 'string',
        required: true,
        description: 'Start date (YYYY-MM-DD)'
      },
      {
        name: 'end',
        type: 'string',
        required: true,
        description: 'End date (YYYY-MM-DD)'
      },
      {
        name: 'limit',
        type: 'number',
        required: true,
        description: 'Number of records per page'
      },
      {
        name: 'page',
        type: 'number',
        required: true,
        description: 'Page number'
      }
    ]
  },
  {
    name: 'Get Customers by Last Update',
    path: '/customers/last-update/{start}/{end}/{limit}/{page}',
    method: 'GET',
    description: 'Get customers filtered by last update time',
    parameters: [
      {
        name: 'start',
        type: 'number',
        required: true,
        description: 'Start timestamp'
      },
      {
        name: 'end',
        type: 'number',
        required: true,
        description: 'End timestamp'
      },
      {
        name: 'limit',
        type: 'number',
        required: true,
        description: 'Number of records per page'
      },
      {
        name: 'page',
        type: 'number',
        required: true,
        description: 'Page number'
      }
    ]
  },
  {
    name: 'Get Customers in Group',
    path: '/customers/groups/{id}',
    method: 'GET',
    description: 'Get all customers in a specific group',
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Group ID'
      }
    ]
  },
  {
    name: 'Get All Products',
    path: '/products',
    method: 'GET',
    description: 'Get a list of all available products',
    parameters: []
  },
  {
    name: 'Get Product',
    path: '/products/{sku}',
    method: 'GET',
    description: 'Get details for a specific product',
    parameters: [
      {
        name: 'sku',
        type: 'string',
        required: true,
        description: 'Product SKU'
      }
    ]
  },
  {
    name: 'Get Archived Products',
    path: '/products/archived',
    method: 'GET',
    description: 'Get a list of all archived products',
    parameters: []
  },
  {
    name: 'Get Active Wishes',
    path: '/wishes',
    method: 'GET',
    description: 'Get a list of all active wish requests',
    parameters: []
  }
];

export function ApiTestPage() {
  const { request, loading } = useApi();
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEndpointChange = (value: string) => {
    const endpoint = ENDPOINTS.find(e => e.path === value);
    setSelectedEndpoint(endpoint || null);
    setParamValues({});
    setResponse(null);
    setError(null);
  };

  const handleParamChange = (name: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTest = async () => {
    if (!selectedEndpoint) return;

    try {
      setError(null);
      setResponse(null);

      // Validate required parameters
      const missingParams = selectedEndpoint.parameters
        .filter(p => p.required && !paramValues[p.name]);

      if (missingParams.length > 0) {
        setError(`Missing required parameters: ${missingParams.map(p => p.name).join(', ')}`);
        return;
      }

      // Build the path with parameters
      let path = selectedEndpoint.path;
      selectedEndpoint.parameters.forEach(param => {
        path = path.replace(`{${param.name}}`, paramValues[param.name] || '');
      });

      // Make the request
      const result = await request(async (client) => {
        switch (selectedEndpoint.name) {
          case 'Get All Groups':
            return client.getGroups();
          case 'Get Group':
            return client.getGroup(paramValues.id);
          case 'Get All Clubs':
            return client.getClubs();
          case 'Get Club':
            return client.getClub(paramValues.id);
          case 'Get Customer':
            return client.getCustomer(paramValues.id);
          case 'Get Customers by Signup Date':
            return client.getCustomersBySignup(
              paramValues.start,
              paramValues.end,
              parseInt(paramValues.limit),
              parseInt(paramValues.page)
            );
          case 'Get Customers by Last Update':
            return client.getCustomersByLastUpdate(
              parseInt(paramValues.start),
              parseInt(paramValues.end),
              parseInt(paramValues.limit),
              parseInt(paramValues.page)
            );
          case 'Get Customers in Group':
            return client.getCustomersInGroup(paramValues.id);
          case 'Get All Products':
            return client.getAvailableProducts();
          case 'Get Product':
            return client.getProduct(paramValues.sku);
          case 'Get Archived Products':
            return client.getArchivedProducts();
          case 'Get Active Wishes':
            return client.getActiveWishes();
          default:
            throw new Error('Unknown endpoint');
        }
      });

      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">API Test Console</h1>
          <p className="mt-2 text-gray-600">
            Test and explore the Offset Reporting API endpoints
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Endpoint
              </label>
              <Select
                value={selectedEndpoint?.path}
                onValueChange={handleEndpointChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {ENDPOINTS.map(endpoint => (
                    <SelectItem key={endpoint.path} value={endpoint.path}>
                      {endpoint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEndpoint && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {selectedEndpoint.method}
                    </span>
                    <code className="font-mono text-gray-800">
                      {selectedEndpoint.path}
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedEndpoint.description}
                  </p>
                </div>

                {selectedEndpoint.parameters.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Parameters</h3>
                    <div className="space-y-3">
                      {selectedEndpoint.parameters.map(param => (
                        <div key={param.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {param.name}
                            {param.required && <span className="text-red-500">*</span>}
                          </label>
                          <Input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={paramValues[param.name] || ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            placeholder={param.description}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleTest}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Endpoint'
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Response Panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Response</h3>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-600 whitespace-pre-wrap">
                  {error}
                </div>
              ) : response ? (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="text-gray-500 text-center">
                  Select an endpoint and click "Test Endpoint" to see the response
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiTestPage