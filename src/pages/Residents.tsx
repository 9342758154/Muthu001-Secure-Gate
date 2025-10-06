import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building, ArrowLeft, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Resident, FamilyMember } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Residents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [formData, setFormData] = useState({
    flatNo: '',
    ownerName: '',
    age: '',
    totalMembers: '',
    members: [] as FamilyMember[],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadResidents();
  }, [user, navigate]);

  const loadResidents = () => {
    const storedResidents = JSON.parse(localStorage.getItem('residents') || '[]');
    setResidents(storedResidents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const residentData: Resident = {
      id: editingResident?.id || Date.now().toString(),
      flatNo: formData.flatNo,
      ownerName: formData.ownerName,
      age: parseInt(formData.age),
      totalMembers: parseInt(formData.totalMembers),
      members: formData.members,
      createdAt: editingResident?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storedResidents = JSON.parse(localStorage.getItem('residents') || '[]');
    
    if (editingResident) {
      const index = storedResidents.findIndex((r: Resident) => r.id === editingResident.id);
      storedResidents[index] = residentData;
      toast({ title: 'Success', description: 'Resident updated successfully' });
    } else {
      storedResidents.push(residentData);
      toast({ title: 'Success', description: 'Resident added successfully' });
    }

    localStorage.setItem('residents', JSON.stringify(storedResidents));
    loadResidents();
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setFormData({
      flatNo: resident.flatNo,
      ownerName: resident.ownerName,
      age: resident.age.toString(),
      totalMembers: resident.totalMembers.toString(),
      members: resident.members,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const storedResidents = JSON.parse(localStorage.getItem('residents') || '[]');
    const filtered = storedResidents.filter((r: Resident) => r.id !== id);
    localStorage.setItem('residents', JSON.stringify(filtered));
    loadResidents();
    toast({ title: 'Success', description: 'Resident deleted successfully' });
  };

  const resetForm = () => {
    setFormData({ flatNo: '', ownerName: '', age: '', totalMembers: '', members: [] });
    setEditingResident(null);
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { id: Date.now().toString(), name: '', age: 0, relation: '' }],
    });
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string | number) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const removeMember = (index: number) => {
    setFormData({ ...formData, members: formData.members.filter((_, i) => i !== index) });
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
              <Building className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold">Resident Management</h1>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingResident ? 'Edit Resident' : 'Add New Resident'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalMembers">Total Members</Label>
                    <Input
                      id="totalMembers"
                      type="number"
                      value={formData.totalMembers}
                      onChange={(e) => setFormData({ ...formData, totalMembers: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Family Members</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  {formData.members.map((member, index) => (
                    <Card key={member.id}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateMember(index, 'name', e.target.value)}
                          />
                          <Input
                            placeholder="Age"
                            type="number"
                            value={member.age}
                            onChange={(e) => updateMember(index, 'age', parseInt(e.target.value))}
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Relation"
                              value={member.relation}
                              onChange={(e) => updateMember(index, 'relation', e.target.value)}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button type="submit" className="w-full">
                  {editingResident ? 'Update Resident' : 'Add Resident'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residents.map((resident) => (
            <Card key={resident.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-accent">Flat {resident.flatNo}</div>
                    <div className="text-lg font-normal mt-1">{resident.ownerName}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(resident)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(resident.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Age: {resident.age}</p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Members: {resident.totalMembers}
                  </p>
                  {resident.members.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-medium mb-2">Family Members:</p>
                      <ul className="space-y-1">
                        {resident.members.map((member) => (
                          <li key={member.id} className="text-muted-foreground">
                            {member.name} ({member.age}) - {member.relation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {residents.length === 0 && (
          <div className="text-center py-16">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No residents added yet. Click "Add Resident" to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Residents;
