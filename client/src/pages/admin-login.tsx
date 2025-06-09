import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Shield, Lock } from "lucide-react";
import { loginSchema, type LoginCredentials } from "@shared/schema";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast({
        title: "Login berhasil!",
        description: "Selamat datang di panel admin.",
      });
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login gagal",
        description: "Username atau password salah!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Login Admin</CardTitle>
          <CardDescription>
            Masuk untuk mengelola dokumentasi OSIS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Lock className="h-4 w-4 mr-2" />
                {isLoading ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Demo: Username: <span className="font-mono bg-slate-100 px-2 py-1 rounded">admin</span>, 
              Password: <span className="font-mono bg-slate-100 px-2 py-1 rounded">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
