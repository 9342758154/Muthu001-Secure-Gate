import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Plus, Edit, LogOut as LogOutIcon } from 'lucide-react';
import { Visitor } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Visitors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    type: 'relative' as 'delivery' | 'relative' | 'guest',
    flatNo: '',
    purpose: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadVisitors();

    const interval = setInterval(loadVisitors, 1000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadVisitors = () => {
    const storedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    setVisitors(storedVisitors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const visitorData: Visitor = {
      id: editingVisitor?.id || Date.now().toString(),
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      type: formData.type,
      flatNo: formData.flatNo,
      purpose: formData.purpose,
      inTime: editingVisitor?.inTime || new Date().toISOString(),
      outTime: editingVisitor?.outTime || null,
      createdAt: editingVisitor?.createdAt || new Date().toISOString(),
    };

    const storedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    
    if (editingVisitor) {
      const index = storedVisitors.findIndex((v: Visitor) => v.id === editingVisitor.id);
      storedVisitors[index] = visitorData;
      toast({ title: 'Success', description: 'Visitor updated successfully' });
    } else {
      storedVisitors.unshift(visitorData);
      toast({ title: 'Success', description: 'Visitor checked in successfully' });
    }

    localStorage.setItem('visitors', JSON.stringify(storedVisitors));
    loadVisitors();
    resetForm();
    setIsDialogOpen(false);
  };

  const handleCheckOut = (id: string) => {
    const storedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    const index = storedVisitors.findIndex((v: Visitor) => v.id === id);
    storedVisitors[index].outTime = new Date().toISOString();
    localStorage.setItem('visitors', JSON.stringify(storedVisitors));
    loadVisitors();
    toast({ title: 'Success', description: 'Visitor checked out successfully' });
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      name: visitor.name,
      mobileNumber: visitor.mobileNumber,
      type: visitor.type,
      flatNo: visitor.flatNo,
      purpose: visitor.purpose,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', mobileNumber: '', type: 'relative', flatNo: '', purpose: '' });
    setEditingVisitor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold">Visitor Management</h1>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Check In Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVisitor ? 'Edit Visitor' : 'Check In Visitor'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Visitor Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Visitor Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="relative">Relative</option>
                    <option value="delivery">Delivery</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flatNo">Flat Number</Label>
                  <Input
                    id="flatNo"
                    value={formData.flatNo}
                    onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingVisitor ? 'Update Visitor' : 'Check In'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {visitors.map((visitor) => (
            <Card key={visitor.id} className={`hover:shadow-lg transition-shadow ${!visitor.outTime ? 'border-accent border-2' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{visitor.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        !visitor.outTime 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {!visitor.outTime ? 'Active' : 'Checked Out'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                        {visitor.type}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p>📱 {visitor.mobileNumber}</p>
                        <p>🏢 Flat {visitor.flatNo}</p>
                        <p>📝 {visitor.purpose}</p>
                      </div>
                      <div>
                        <p>⏰ In: {new Date(visitor.inTime).toLocaleString()}</p>
                        {visitor.outTime && (
                          <p>⏰ Out: {new Date(visitor.outTime).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!visitor.outTime && (
                      <>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(visitor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleCheckOut(visitor.id)}>
                          <LogOutIcon className="h-4 w-4 mr-2" />
                          Check Out
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {visitors.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No visitors yet. Click "Check In Visitor" to add one.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Visitors;
