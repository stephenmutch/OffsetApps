import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileSearch, 
  Mail, 
  Truck, 
  Workflow, 
  BarChart3, 
  FileText,
  ExternalLink,
  Wine
} from 'lucide-react';

interface AppCardProps {
  icon: React.ElementType;
  name: string;
  description: string;
  enabled: boolean;
  href?: string;
  comingSoon?: boolean;
}

function AppCard({ icon: Icon, name, description, enabled, href, comingSoon }: AppCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (enabled && href) {
      navigate(href);
    }
  };

  return (
    <div
      className={`
        relative group rounded-lg border bg-white p-6 transition-all duration-200
        ${enabled ? 'cursor-pointer hover:shadow-md hover:border-blue-200' : 'opacity-75'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${enabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          <Icon className="w-6 h-6" />
        </div>
        {enabled && !comingSoon && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
            Enabled
          </span>
        )}
        {comingSoon && (
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
            Coming Soon
          </span>
        )}
      </div>

      <h3 className={`mt-4 text-lg font-semibold ${enabled ? 'text-gray-900' : 'text-gray-600'}`}>
        {name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      {enabled && !comingSoon && (
        <div className="mt-4 flex items-center text-sm text-blue-600">
          <span>Open app</span>
          <ExternalLink className="ml-1 w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const apps = [
    {
      icon: Users,
      name: 'Allocations',
      description: 'Manage wine allocations and customer tiers',
      enabled: true,
      href: '/allocations'
    },
    {
      icon: FileSearch,
      name: 'Queries',
      description: 'Run custom queries and generate reports',
      enabled: true,
      href: '/queries'
    },
    {
      icon: Wine,
      name: 'Clubs',
      description: 'Manage wine club memberships and benefits',
      enabled: false,
      comingSoon: true
    },
    {
      icon: Mail,
      name: 'MailChimp',
      description: 'Email marketing and automation',
      enabled: false,
      comingSoon: true
    },
    {
      icon: Truck,
      name: 'PODE',
      description: 'Post Order Delivery Experience',
      enabled: false,
      comingSoon: true
    },
    {
      icon: Workflow,
      name: 'Workflows',
      description: 'Automate business processes',
      enabled: false,
      comingSoon: true
    },
    {
      icon: BarChart3,
      name: 'Analytics',
      description: 'Business intelligence and insights',
      enabled: false,
      comingSoon: true
    },
    {
      icon: FileText,
      name: 'Reporting',
      description: 'Generate and schedule reports',
      enabled: false,
      comingSoon: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Apps</h1>
        <p className="mt-2 text-gray-600">
          Access your enabled applications and discover new features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <AppCard key={app.name} {...app} />
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900">Need more apps?</h2>
        <p className="mt-2 text-gray-600">
          Contact your account manager to enable additional applications or request new features.
        </p>
      </div>
    </div>
  );
}