import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Shield, Users, Clock, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: 'Secure Access', description: 'Complete security management system' },
    { icon: Users, title: 'Resident Management', description: 'Track all residents and family members' },
    { icon: Clock, title: 'Real-time Tracking', description: 'Monitor visitor entries and exits' },
    { icon: BarChart, title: 'Analytics', description: 'Comprehensive reports and insights' },
  ];

  const plans = [
    {
      name: 'Monthly',
      price: '$29',
      period: '/month',
      features: ['Unlimited Residents', 'Unlimited Visitors', 'Real-time Updates', '24/7 Support', 'Analytics Dashboard'],
      popular: false,
    },
    {
      name: 'Yearly',
      price: '$290',
      period: '/year',
      features: ['Unlimited Residents', 'Unlimited Visitors', 'Real-time Updates', 'Priority Support', 'Advanced Analytics', '2 Months Free'],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-primary-foreground mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Secure Gate Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Modern apartment security system for real-time visitor and resident management
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/95 backdrop-blur border-accent/20">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-accent mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Pricing */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Choose Your Plan</h2>
          <p className="text-primary-foreground/80 text-lg">Simple, transparent pricing for your security needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-accent border-2 shadow-2xl' : 'bg-card/95'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => navigate('/register', { state: { subscription: plan.name.toLowerCase() } })}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
