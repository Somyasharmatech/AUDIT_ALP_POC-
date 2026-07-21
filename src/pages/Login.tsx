import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/src/store';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setAuthInitialized } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@auditalp.com',
      password: 'admin123'
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const result = await response.json();
      localStorage.setItem('token', result.token);
      setUser(result.user);
      setAuthInitialized(true);
      toast.success("Signed in successfully");
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <Card className="w-full max-w-md shadow-sm border-[#DEE2E6] bg-white">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#005A9E]">AUDIT ALP</CardTitle>
          <CardDescription className="text-[#6C757D]">
            Enter your credentials to access the workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#212529]">Email Address</label>
              <input 
                {...register("email")}
                type="email"
                className={`w-full h-9 px-3 rounded-sm border ${errors.email ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                placeholder="name@company.com"
                disabled={isLoading}
              />
              {errors.email && <p className="text-[11px] text-[#DC3545] mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#212529]">Password</label>
              <input 
                {...register("password")}
                type="password" 
                className={`w-full h-9 px-3 rounded-sm border ${errors.password ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && <p className="text-[11px] text-[#DC3545] mt-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#005A9E] hover:bg-[#004578] rounded-sm h-9 text-[13px] font-medium mt-2 transition-colors"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            
          </form>
          <div className="mt-4 pt-4 border-t border-[#DEE2E6] text-center">
            <p className="text-[11px] text-[#6C757D]">Demo Credentials:<br/>admin@auditalp.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
