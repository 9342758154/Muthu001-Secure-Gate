import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building, Users, UserCheck, LogOut, Menu } from 'lucide-react';
import { Resident, Visitor } from '@/types';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const storedResidents = JSON.parse(localStorage.getItem('residents') || '[]');
    const storedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    
    setResidents(storedResidents);
    setVisitors(storedVisitors);
    setActiveVisitors(storedVisitors.filter((v: Visitor) => !v.outTime).length);

    const interval = setInterval(() => {
      const updatedVisitors = JSON.parse(localStorage.getItem('visitors') || '[]');
      setVisitors(updatedVisitors);
      setActiveVisitors(updatedVisitors.filter((v: Visitor) => !v.outTime).length);
    }, 1000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { title: 'Total Residents', value: residents.length, icon: Building, color: 'text-primary' },
    { title: 'Total Visitors Today', value: visitors.length, icon: Users, color: 'text-accent' },
    { title: 'Active Visitors', value: activeVisitors, icon: UserCheck, color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold">Secure Gate</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/residents')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" />
                Manage Residents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add, edit, or view resident information and family members
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/visitors')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                Manage Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Log visitor entries, track check-ins and check-outs in real-time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            {visitors.slice(0, 5).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No visitors yet</p>
            ) : (
              <div className="space-y-4">
                {visitors.slice(0, 5).map((visitor) => (
                  <div key={visitor.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Flat {visitor.flatNo} • {visitor.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">In: {new Date(visitor.inTime).toLocaleTimeString()}</p>
                      {visitor.outTime ? (
                        <p className="text-sm text-muted-foreground">
                          Out: {new Date(visitor.outTime).toLocaleTimeString()}
                        </p>
                      ) : (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Active</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
