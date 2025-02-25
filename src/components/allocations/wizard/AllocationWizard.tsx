import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AllocationBasicInfo } from './steps/AllocationBasicInfo';
import { AllocationMessaging } from './steps/AllocationMessaging';
import { PurchaseRequirements } from './steps/PurchaseRequirements';
import { DiscountSettings } from './steps/DiscountSettings';
import { ProductSelection } from './steps/ProductSelection';
import { Button } from '@/components/ui/button';

const STEPS = [
  { 
    title: 'Basic Information',
    description: 'Set allocation name and schedule',
    subtitle: 'Configure the fundamental details of your allocation'
  },
  { 
    title: 'Messaging',
    description: 'Configure customer communications',
    subtitle: 'Set up the messages your customers will see'
  },
  { 
    title: 'Purchase Requirements',
    description: 'Define purchase limits',
    subtitle: 'Set minimum and maximum purchase requirements'
  },
  { 
    title: 'Discounts',
    description: 'Set up pricing discounts',
    subtitle: 'Configure order and shipping discounts'
  },
  { 
    title: 'Products',
    description: 'Select available products',
    subtitle: 'Choose and configure available products'
  },
];

export function AllocationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      startDate: '',
      endDate: '',
      allocationType: 'individual' as 'individual' | 'tier'
    },
    messaging: {
      title: '',
      message: '',
      confirmationMessage: ''
    },
    requirements: {
      cartMin: 0,
      cartMax: 0,
      minAmount: 0
    },
    discounts: {
      orderDiscount: {
        type: 'percentage' as 'percentage' | 'fixed',
        amount: 0
      },
      shippingDiscount: {
        type: 'percentage' as 'percentage' | 'fixed',
        amount: 0,
        method: ''
      }
    },
    products: []
  });
  const navigate = useNavigate();

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .insert([
          {
            name: formData.basicInfo.name,
            start_date: formData.basicInfo.startDate,
            end_date: formData.basicInfo.endDate,
            allocation_type: formData.basicInfo.allocationType,
            status: 'draft',
            title: formData.messaging.title,
            message: formData.messaging.message,
            confirmation_message: formData.messaging.confirmationMessage,
            cart_min: formData.requirements.cartMin,
            cart_max: formData.requirements.cartMax,
            min_amount: formData.requirements.minAmount,
            order_discount_type: formData.discounts.orderDiscount?.type,
            order_discount_amount: formData.discounts.orderDiscount?.amount,
            shipping_discount_type: formData.discounts.shippingDiscount?.type,
            shipping_discount_amount: formData.discounts.shippingDiscount?.amount,
            shipping_discount_method: formData.discounts.shippingDiscount?.method
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Insert products if any are selected
      if (formData.products.length > 0) {
        const { error: productsError } = await supabase
          .from('allocation_products')
          .insert(
            formData.products.map((product: any) => ({
              allocation_id: data.id,
              product_id: product.id,
              override_price: product.overridePrice,
              min_purchase: product.minPurchase,
              max_purchase: product.maxPurchase,
              allow_wish_requests: product.allowWishRequests,
              wish_request_min: product.wishRequestMin,
              wish_request_max: product.wishRequestMax,
              total_inventory: 0,
              remaining_inventory: 0
            }))
          );

        if (productsError) throw productsError;
      }

      navigate(`/allocations/${data.id}`);
    } catch (error) {
      console.error('Error creating allocation:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AllocationBasicInfo 
          data={formData.basicInfo} 
          onUpdate={(data) => updateFormData('basicInfo', data)} 
        />;
      case 1:
        return <AllocationMessaging 
          data={formData.messaging} 
          onUpdate={(data) => updateFormData('messaging', data)} 
        />;
      case 2:
        return <PurchaseRequirements 
          data={formData.requirements} 
          onUpdate={(data) => updateFormData('requirements', data)} 
        />;
      case 3:
        return <DiscountSettings 
          data={formData.discounts} 
          onUpdate={(data) => updateFormData('discounts', data)} 
        />;
      case 4:
        return <ProductSelection 
          data={formData.products} 
          onUpdate={(data) => updateFormData('products', data)} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      {/* Progress Steps */}
      <div className="border-b overflow-x-auto">
        <div className="px-4 md:px-6 py-4 min-w-[600px]">
          <div className="flex justify-between">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                <div className="mt-2 text-sm font-medium text-center">{step.title}</div>
                <div className="text-xs text-muted-foreground text-center">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{STEPS[currentStep].title}</h2>
          <p className="mt-1 text-muted-foreground">{STEPS[currentStep].subtitle}</p>
        </div>
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="border-t px-4 md:px-6 py-4 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        
        {currentStep === STEPS.length - 1 ? (
          <Button onClick={handleSubmit}>
            Create Allocation
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}