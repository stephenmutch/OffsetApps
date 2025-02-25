import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Plus, Filter, ChevronDown, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface CampaignManagementProps {
  allocation: Allocation;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduled_for?: string;
  sent_at?: string;
  metrics: {
    total: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
}

export function CampaignManagement({ allocation }: CampaignManagementProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email' as 'email' | 'sms',
    subject: '',
    content: '',
    scheduled_for: ''
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select(`
            *,
            campaign_recipients (
              status,
              opened_at,
              clicked_at
            )
          `)
          .eq('allocation_id', allocation.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const campaignsWithMetrics = data?.map(campaign => ({
          ...campaign,
          metrics: {
            total: campaign.campaign_recipients?.length || 0,
            delivered: campaign.campaign_recipients?.filter(r => r.status === 'delivered').length || 0,
            opened: campaign.campaign_recipients?.filter(r => r.opened_at).length || 0,
            clicked: campaign.campaign_recipients?.filter(r => r.clicked_at).length || 0
          }
        })) || [];

        setCampaigns(campaignsWithMetrics);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [allocation.id]);

  const handleCreateCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          allocation_id: allocation.id,
          name: newCampaign.name,
          type: newCampaign.type,
          subject: newCampaign.subject,
          content: newCampaign.content,
          scheduled_for: newCampaign.scheduled_for || null
        })
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => [{ ...data, metrics: { total: 0, delivered: 0, opened: 0, clicked: 0 } }, ...prev]);
      setShowNewCampaign(false);
      setNewCampaign({
        name: '',
        type: 'email',
        subject: '',
        content: '',
        scheduled_for: ''
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Mail className="text-purple-600" size={20} />
          <div className="flex-1">
            <span className="text-purple-900">
              368 customers haven't made a purchase yet. Sending a reminder email could generate $1,667,000 in revenue.
            </span>
          </div>
          <Button variant="outline" className="text-purple-600 hover:text-purple-700">
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Mail className="h-5 w-5" />
            <span className="text-sm">Email Campaigns</span>
          </div>
          <div className="text-2xl font-semibold">
            {campaigns.filter(c => c.type === 'email').length}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {campaigns.filter(c => c.type === 'email' && c.status === 'sent').length} sent
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">SMS Campaigns</span>
          </div>
          <div className="text-2xl font-semibold">
            {campaigns.filter(c => c.type === 'sms').length}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {campaigns.filter(c => c.type === 'sms' && c.status === 'sent').length} sent
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Scheduled</span>
          </div>
          <div className="text-2xl font-semibold">
            {campaigns.filter(c => c.status === 'scheduled').length}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            campaigns pending
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm">Average Open Rate</span>
          </div>
          <div className="text-2xl font-semibold">
            {Math.round(
              (campaigns.reduce((sum, c) => sum + (c.metrics.opened / c.metrics.delivered) * 100, 0) / 
              campaigns.filter(c => c.metrics.delivered > 0).length) || 0
            )}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            across all campaigns
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Campaigns</h3>
            <Dialog open={showNewCampaign} onOpenChange={setShowNewCampaign}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Campaign Name</Label>
                    <Input
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Campaign Type</Label>
                    <Select
                      value={newCampaign.type}
                      onValueChange={(value: 'email' | 'sms') => setNewCampaign(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newCampaign.type === 'email' && (
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter email subject"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={`Enter campaign ${newCampaign.type === 'email' ? 'message' : 'SMS'} content`}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule For (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={newCampaign.scheduled_for}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduled_for: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCampaign}>
                    Create Campaign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <Input placeholder="Search campaigns..." />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Campaign</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Type</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Status</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Recipients</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Delivered</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Opened</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Clicked</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      {campaign.type === 'email' && campaign.subject && (
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.type === 'email'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {campaign.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : campaign.status === 'scheduled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : campaign.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right">{campaign.metrics.total}</td>
                  <td className="p-4 text-right">{campaign.metrics.delivered}</td>
                  <td className="p-4 text-right">
                    {campaign.metrics.opened} ({Math.round((campaign.metrics.opened / campaign.metrics.delivered) * 100)}%)
                  </td>
                  <td className="p-4 text-right">
                    {campaign.metrics.clicked} ({Math.round((campaign.metrics.clicked / campaign.metrics.delivered) * 100)}%)
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}