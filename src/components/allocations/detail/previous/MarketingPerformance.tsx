import React from 'react';
import { Mail, MessageSquare, Bell, TrendingUp } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface MarketingPerformanceProps {
  allocation: Allocation;
}

export function MarketingPerformance({ allocation }: MarketingPerformanceProps) {
  // Mock data - replace with real data from API
  const metrics = {
    totalCampaigns: 8,
    emailsSent: 12500,
    emailsOpened: 9375,
    emailsClicked: 3750,
    smsDelivered: 5000,
    smsClicked: 2000,
    campaigns: [
      {
        id: 'c1',
        name: 'Early Access Announcement',
        type: 'email',
        sent: 5000,
        delivered: 4950,
        opened: 3960,
        clicked: 1980,
        revenue: 495000
      },
      {
        id: 'c2',
        name: 'Last Chance Reminder',
        type: 'email',
        sent: 4000,
        delivered: 3960,
        opened: 3168,
        clicked: 1584,
        revenue: 396000
      },
      {
        id: 'c3',
        name: 'SMS Reminder',
        type: 'sms',
        sent: 2500,
        delivered: 2475,
        opened: 1980,
        clicked: 990,
        revenue: 247500
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Mail className="h-5 w-5" />
            <span className="text-sm">Email Performance</span>
          </div>
          <div className="text-2xl font-semibold">
            {Math.round((metrics.emailsOpened / metrics.emailsSent) * 100)}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            open rate
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">SMS Performance</span>
          </div>
          <div className="text-2xl font-semibold">
            {Math.round((metrics.smsClicked / metrics.smsDelivered) * 100)}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            click-through rate
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Bell className="h-5 w-5" />
            <span className="text-sm">Total Campaigns</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.totalCampaigns}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            campaigns sent
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Campaign Revenue</span>
          </div>
          <div className="text-2xl font-semibold">
            ${metrics.campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            attributed revenue
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Campaign Performance</h3>
          <p className="mt-1 text-sm text-gray-500">
            Detailed breakdown of each campaign's performance
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Campaign</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Type</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Sent</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Delivered</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Opened</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Clicked</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.campaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{campaign.name}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.type === 'email'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {campaign.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">{campaign.sent.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    {campaign.delivered.toLocaleString()}
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.round((campaign.delivered / campaign.sent) * 100)}%)
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {campaign.opened.toLocaleString()}
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.round((campaign.opened / campaign.delivered) * 100)}%)
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {campaign.clicked.toLocaleString()}
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.round((campaign.clicked / campaign.opened) * 100)}%)
                    </span>
                  </td>
                  <td className="p-4 text-right">${campaign.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Email Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Open Rate</span>
                <span className="text-sm font-medium">
                  {Math.round((metrics.emailsOpened / metrics.emailsSent) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(metrics.emailsOpened / metrics.emailsSent) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Click Rate</span>
                <span className="text-sm font-medium">
                  {Math.round((metrics.emailsClicked / metrics.emailsOpened) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${(metrics.emailsClicked / metrics.emailsOpened) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Campaign Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Early Access Success</p>
                <p className="mt-1 text-sm text-gray-500">
                  Early access email campaigns showed 40% higher engagement
                  and generated 25% more revenue per recipient.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">SMS Effectiveness</p>
                <p className="mt-1 text-sm text-gray-500">
                  SMS reminders drove 35% of last-minute purchases,
                  particularly effective for premium wines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}