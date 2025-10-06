import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscription: (location.state?.subscription as 'monthly' | 'yearly') || 'monthly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const success = await register(formData.email, formData.password, formData.name, formData.subscription);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Email already exists',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-accent" />
          </div>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Register as security personnel</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="security@apartment.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscription">Subscription Plan</Label>
              <select
                id="subscription"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.subscription}
                onChange={(e) => setFormData({ ...formData, subscription: e.target.value as 'monthly' | 'yearly' })}
              >
                <option value="monthly">Monthly - $29/month</option>
                <option value="yearly">Yearly - $290/year</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Register</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/login')}>
              Already have an account? Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
