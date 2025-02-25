import React, { useState, useMemo, useCallback, Suspense, lazy, useEffect } from 'react';
import { Plus, Search, Tag, Users, FileSearch, Wine, X, ChevronUp, ChevronDown, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { TierConfiguration } from './TierConfiguration';
import { TierProductOverrides } from './TierProductOverrides';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

// Lazy load source-specific components
const CustomerSearch = lazy(() => import('./sources/CustomerSearch'));
const QueryList = lazy(() => import('./sources/QueryList'));
const TagList = lazy(() => import('./sources/TagList'));
const GroupList = lazy(() => import('./sources/GroupList'));
const ClubList = lazy(() => import('./sources/ClubList'));

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface AllocationTiersProps {
  allocation: Allocation;
}

const CUSTOMER_SOURCES = [
  {
    id: 'query',
    name: 'Queries',
    icon: FileSearch,
    description: 'Choose queries to add matching customers to this tier'
  },
  {
    id: 'tag',
    name: 'Tags',
    icon: Tag,
    description: 'Select customer tags to add tagged customers to this tier'
  },
  {
    id: 'group',
    name: 'Groups',
    icon: Users,
    description: 'Add customers from selected customer groups'
  },
  {
    id: 'club',
    name: 'Clubs',
    icon: Wine,
    description: 'Add customers from wine club memberships'
  },
  {
    id: 'search',
    name: 'Search',
    icon: Search,
    description: 'Search and select individual customers to add'
  }
] as const;

type CustomerSourceId = typeof CUSTOMER_SOURCES[number]['id'];

interface SelectedSource {
  sourceId: CustomerSourceId;
  items: Array<{
    id: string;
    name: string;
    count?: number;
  }>;
}

// Mock data mapping for selected items
const MOCK_ITEM_DATA: Record<string, { name: string; count?: number }> = {
  'q1': { name: 'High Value Customers', count: 150 },
  'q2': { name: 'Recent Purchasers', count: 75 },
  'q3': { name: 'Club Members', count: 200 },
  't1': { name: 'VIP', count: 150 },
  't2': { name: 'Collector', count: 75 },
  't3': { name: 'Early Access', count: 200 },
  'g1': { name: 'West Coast', count: 500 },
  'g2': { name: 'East Coast', count: 300 },
  'g3': { name: 'Trade', count: 100 },
  'c1': { name: 'Reserve Club', count: 250 },
  'c2': { name: 'Reds Only', count: 175 },
  'c3': { name: 'Mixed Club', count: 300 },
  'cust1': { name: 'John Doe' },
  'cust2': { name: 'Jane Smith' },
  'cust3': { name: 'Bob Wilson' }
};

interface TierFormData {
  name: string;
  level: number;
  accessStart: string;
  accessEnd: string;
  overrides: {
    requirements?: {
      cartMin?: number;
      cartMax?: number;
      minAmount?: number;
    };
    discounts?: {
      type?: 'percentage' | 'fixed';
      amount?: number;
    };
    shipping?: {
      method?: string;
      type?: 'percentage' | 'fixed';
      amount?: number;
    };
    products?: boolean;
  };
}

interface TierData {
  id: string;
  name: string;
  level: number;
  access_start: string;
  access_end: string;
  customer_count: number;
  overrides?: {
    requirements?: any;
    discounts?: any;
    shipping?: any;
    has_product_overrides?: boolean;
  };
}

const CustomerSourceSelector = React.memo(({ 
  selectedSource, 
  onSourceChange 
}: {
  selectedSource: CustomerSourceId;
  onSourceChange: (source: CustomerSourceId) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {CUSTOMER_SOURCES.map(source => (
      <button
        key={source.id}
        onClick={() => onSourceChange(source.id)}
        className={`
          relative group rounded-lg border bg-white p-6 transition-all duration-200
          ${selectedSource === source.id 
            ? 'bg-primary/5 border-primary/20' 
            : 'bg-card hover:bg-accent/50'}
        `}
      >
        <source.icon className="w-6 h-6" />
        <span className="text-sm font-medium text-center">{source.name}</span>
      </button>
    ))}
  </div>
));

CustomerSourceSelector.displayName = 'CustomerSourceSelector';

export function AllocationTiers({ allocation }: AllocationTiersProps) {
  const [showTierForm, setShowTierForm] = useState(false);
  const [selectedSource, setSelectedSource] = useState<CustomerSourceId>('query');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<SelectedSource[]>([]);
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showProductOverrides, setShowProductOverrides] = useState<string | null>(null);
  const [showProductOverridesForm, setShowProductOverridesForm] = useState(false);
  const [formData, setFormData] = useState<TierFormData>({
    name: '',
    level: 1,
    accessStart: '',
    accessEnd: '',
    overrides: {}
  });

  const handleSourceChange = useCallback((source: CustomerSourceId) => {
    setSelectedSource(source);
    setSelectedItems([]);
  }, []);

  const handleItemSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newItems = prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id];

      // Update selected sources when items change
      const currentSource = selectedSource;
      const itemData = MOCK_ITEM_DATA[id];
      
      if (newItems.length === 0) {
        setSelectedSources(prev => prev.filter(s => s.sourceId !== currentSource));
      } else {
        setSelectedSources(prev => {
          const sourceIndex = prev.findIndex(s => s.sourceId === currentSource);
          const selectedSourceItems = newItems
            .filter(itemId => MOCK_ITEM_DATA[itemId])
            .map(itemId => ({
              id: itemId,
              ...MOCK_ITEM_DATA[itemId]
            }));

          if (sourceIndex === -1) {
            return [...prev, { sourceId: currentSource, items: selectedSourceItems }];
          }

          const newSources = [...prev];
          newSources[sourceIndex] = { sourceId: currentSource, items: selectedSourceItems };
          return newSources;
        });
      }

      return newItems;
    });
  }, [selectedSource]);

  const removeSource = useCallback((sourceId: CustomerSourceId) => {
    setSelectedSources(prev => prev.filter(s => s.sourceId !== sourceId));
    if (sourceId === selectedSource) {
      setSelectedItems([]);
    }
  }, [selectedSource]);

  const sourceDescription = useMemo(() => 
    CUSTOMER_SOURCES.find(s => s.id === selectedSource)?.description,
    [selectedSource]
  );

  const totalCustomers = useMemo(() => 
    selectedSources.reduce((total, source) => 
      total + (source.items.reduce((sum, item) => sum + (item.count || 1), 0)),
      0
    ),
    [selectedSources]
  );

  // Fetch existing tiers
  const fetchTiers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('allocation_tiers')
        .select(`
          id,
          name,
          level,
          access_start,
          access_end,
          customer_count
        `)
        .eq('allocation_id', allocation.id)
        .order('level', { ascending: true });

      if (tiersError) throw tiersError;

      // Fetch overrides for each tier
      const tiersWithOverrides = await Promise.all((tiersData || []).map(async (tier) => {
        const { data: overrides } = await supabase
          .from('tier_overrides')
          .select('*')
          .eq('tier_id', tier.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results

        return {
          ...tier,
          overrides: overrides || undefined
        };
      }));

      setTiers(tiersWithOverrides);
    } catch (error) {
      console.error('Error fetching tiers:', error);
    } finally {
      setLoading(false);
    }
  }, [allocation.id]);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  const toggleTierExpanded = (tierId: string) => {
    setExpandedTiers(prev => {
      const next = new Set(prev);
      if (next.has(tierId)) {
        next.delete(tierId);
      } else {
        next.add(tierId);
      }
      return next;
    });
  };

  const renderSourceContent = () => {
    const props = {
      selectedItems,
      onItemSelect: handleItemSelect
    };

    return (
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        {selectedSource === 'search' && <CustomerSearch {...props} />}
        {selectedSource === 'query' && <QueryList {...props} />}
        {selectedSource === 'tag' && <TagList {...props} />}
        {selectedSource === 'group' && <GroupList {...props} />}
        {selectedSource === 'club' && <ClubList {...props} />}
      </Suspense>
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.level || !formData.accessStart || !formData.accessEnd) {
        throw new Error('Please fill in all required fields');
      }

      // Create tier
      const { data: tier, error: tierError } = await supabase
        .from('allocation_tiers')
        .insert({
          allocation_id: allocation.id,
          name: formData.name,
          level: formData.level,
          access_start: new Date(formData.accessStart).toISOString(),
          access_end: new Date(formData.accessEnd).toISOString(),
          customer_count: totalCustomers
        })
        .select()
        .single();

      if (tierError) throw tierError;

      // Create tier overrides if any
      if (Object.keys(formData.overrides).length > 0) {
        const { error: overridesError } = await supabase
          .from('tier_overrides')
          .insert({
            tier_id: tier.id,
            requirements: formData.overrides.requirements || null,
            discounts: formData.overrides.discounts || null,
            shipping: formData.overrides.shipping || null,
            has_product_overrides: !!formData.overrides.products
          });

        if (overridesError) throw overridesError;
      }

      // Create customer assignments
      if (selectedSources.length > 0) {
        const customerAssignments = selectedSources.flatMap(source => 
          source.items.map(item => ({
            allocation_id: allocation.id,
            tier_id: tier.id,
            customer_id: item.id,
            source_type: source.sourceId,
            source_id: item.id,
            created_at: new Date().toISOString()
          }))
        );

        const { error: assignmentError } = await supabase
          .from('customer_tiers')
          .insert(customerAssignments);

        if (assignmentError) throw assignmentError;
      }

      // After successful creation, refresh the tiers list
      await fetchTiers();
      
      // Reset form and close
      setFormData({
        name: '',
        level: 1,
        accessStart: '',
        accessEnd: '',
        overrides: {}
      });
      setSelectedSources([]);
      setSelectedItems([]);
      setShowTierForm(false);
    } catch (error) {
      console.error('Error creating tier:', error);
    }
  };

  const deleteTier = async (tierId: string) => {
    try {
      const { error } = await supabase
        .from('allocation_tiers')
        .delete()
        .eq('id', tierId);

      if (error) throw error;
      await fetchTiers();
    } catch (error) {
      console.error('Error deleting tier:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Allocation Tiers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage customer tiers for this allocation.
          </p>
        </div>
        <Button onClick={() => setShowTierForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Tier
        </Button>
      </div>

      {showTierForm && (
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Create New Tier</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure tier settings and add customers.
            </p>
          </div>

          {/* Basic Information */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tierName">Tier Name</Label>
                <Input
                  id="tierName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Premium Members"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tierLevel">Tier Level</Label>
                <Input
                  type="number"
                  id="tierLevel"
                  min="1"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accessStart">Access Start</Label>
                <Input
                  type="datetime-local"
                  id="accessStart"
                  value={formData.accessStart}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessStart: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessEnd">Access End</Label>
                <Input
                  type="datetime-local"
                  id="accessEnd"
                  value={formData.accessEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessEnd: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Tier Configuration */}
          <div className="border-t pt-6">
            <TierConfiguration
              allocation={allocation}
              value={formData}
              onChange={setFormData}
            />
          </div>

          {formData.overrides.products && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Product Settings</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Configure product-specific settings for this tier.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowProductOverridesForm(true)}
                >
                  Configure Products
                </Button>
              </div>
            </div>
          )}

          {/* Customer Selection */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <Label>Add Customers</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {sourceDescription}
              </p>
            </div>

            <CustomerSourceSelector
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
            />

            <div className="mt-4 border rounded-lg">
              {renderSourceContent()}
            </div>

            {selectedSources.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Selected Sources</h4>
                  <span className="text-sm text-muted-foreground">
                    {totalCustomers.toLocaleString()} total customers
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedSources.map(source => {
                    const sourceInfo = CUSTOMER_SOURCES.find(s => s.id === source.sourceId);
                    const sourceTotal = source.items.reduce((sum, item) => sum + (item.count || 1), 0);
                    
                    return (
                      <div key={source.sourceId} className="bg-background rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {sourceInfo && <sourceInfo.icon className="w-4 h-4" />}
                            <span className="font-medium">{sourceInfo?.name}</span>
                            <span className="text-sm text-muted-foreground">
                              ({sourceTotal.toLocaleString()} customers)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSource(source.sourceId)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {source.items.map(item => (
                            <div key={item.id} className="text-sm flex items-center justify-between">
                              <span>{item.name}</span>
                              {item.count && (
                                <span className="text-muted-foreground">
                                  {item.count.toLocaleString()} customers
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowTierForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Tier</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tiers...</div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tiers created yet. Click "Create Tier" to add your first tier.
          </div>
        ) : (
          tiers.map(tier => (
            <div key={tier.id} className="border rounded-lg">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleTierExpanded(tier.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                    {tier.level}
                  </div>
                  <div>
                    <h3 className="font-medium">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.customer_count.toLocaleString()} customers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTier(tier.id);
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  {expandedTiers.has(tier.id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {expandedTiers.has(tier.id) && (
                <div className="border-t p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Access Start</Label>
                      <p className="mt-1">
                        {new Date(tier.access_start).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Access End</Label>
                      <p className="mt-1">
                        {new Date(tier.access_end).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {tier.overrides && (
                    <>
                      {tier.overrides.requirements && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Purchase Requirements</Label>
                          <div className="mt-1 space-y-1">
                            {tier.overrides.requirements.cartMin && (
                              <p>Minimum Bottles: {tier.overrides.requirements.cartMin}</p>
                            )}
                            {tier.overrides.requirements.cartMax && (
                              <p>Maximum Bottles: {tier.overrides.requirements.cartMax}</p>
                            )}
                            {tier.overrides.requirements.minAmount && (
                              <p>Minimum Amount: ${tier.overrides.requirements.minAmount}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {tier.overrides.discounts && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Discounts</Label>
                          <div className="mt-1 space-y-1">
                            <p>
                              Order Discount: {tier.overrides.discounts.amount}
                              {tier.overrides.discounts.type === 'percentage' ? '%' : '$'}
                            </p>
                          </div>
                        </div>
                      )}

                      {tier.overrides.shipping && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Shipping</Label>
                          <div className="mt-1 space-y-1">
                            <p>Method: {tier.overrides.shipping.method}</p>
                            <p>
                              Discount: {tier.overrides.shipping.amount}
                              {tier.overrides.shipping.type === 'percentage' ? '%' : '$'}
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm text-muted-foreground">Product Settings</Label>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowProductOverrides(tier.id);
                            }}
                          >
                            {tier.overrides.has_product_overrides ? 'Edit Product Overrides' : 'Configure Products'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showProductOverrides && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
            <TierProductOverrides
              allocation={allocation}
              tierId={showProductOverrides}
              onClose={() => {
                setShowProductOverrides(null);
                fetchTiers(); // Refresh tiers to show updated overrides status
              }}
            />
          </div>
        </div>
      )}

      {showProductOverridesForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
            <TierProductOverrides
              allocation={allocation}
              initialOverrides={{}}
              onSave={(overrides) => {
                setFormData(prev => ({
                  ...prev,
                  productOverrides: overrides
                }));
                setShowProductOverridesForm(false);
              }}
              onClose={() => setShowProductOverridesForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}