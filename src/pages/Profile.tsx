import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, User, MapPin, Package } from 'lucide-react';

interface Profile {
  full_name: string;
  phone: string;
  avatar_url?: string;
}

interface Address {
  id?: string;
  full_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  type: string;
  is_default: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    phone: '',
    avatar_url: '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
    type: 'shipping',
    is_default: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    fetchAddresses();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        return;
      }

      setAddresses(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          ...newAddress,
        });

      if (error) {
        console.error('Error adding address:', error);
        toast({
          title: "Error",
          description: "Failed to add address. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Address added successfully.",
      });

      setNewAddress({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        phone: '',
        type: 'shipping',
        is_default: false,
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Card className="card-minimal">
            <CardContent className="p-8">
              <Tabs defaultValue="profile" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card className="card-minimal border">
                    <CardContent className="p-6">
                      <form onSubmit={updateProfile} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="bg-muted/50 h-11"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={profile.full_name}
                            onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Enter your full name"
                            className="h-11"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter your phone number"
                            className="h-11"
                          />
                        </div>

                        <Button type="submit" disabled={isLoading} className="h-11 px-8">
                          {isLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="space-y-6">
                  <Card className="card-minimal border">
                    <CardContent className="p-6">
                      {addresses.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                          <p className="text-muted-foreground">No addresses saved yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addresses.map((address) => (
                            <div key={address.id} className="p-4 bg-muted/20 rounded-lg border">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="font-semibold">{address.full_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.address_line_1}
                                    {address.address_line_2 && `, ${address.address_line_2}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.city}, {address.state} {address.postal_code}
                                  </p>
                                </div>
                                {address.is_default && (
                                  <span className="bg-primary/10 text-primary px-3 py-1 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <Card className="card-minimal border">
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                        <p className="text-muted-foreground mb-6">
                          View your complete order history
                        </p>
                        <Button onClick={() => navigate('/orders')} className="h-11 px-8">
                          View All Orders
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;