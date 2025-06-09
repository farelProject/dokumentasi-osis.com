import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { insertProgramSchema, type Program, type InsertProgram } from "@shared/schema";

export default function AdminPrograms() {
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const form = useForm<InsertProgram>({
    resolver: zodResolver(insertProgramSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "planning",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program berhasil ditambahkan!",
        description: "Program kerja baru telah dibuat.",
      });
      form.reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
    onError: () => {
      toast({
        title: "Gagal menambahkan program",
        description: "Terjadi kesalahan saat membuat program kerja.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProgram> }) => {
      const response = await fetch(`/api/programs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update program");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program berhasil diperbarui!",
      });
      setEditingProgram(null);
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui program",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete program");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program berhasil dihapus!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
    onError: () => {
      toast({
        title: "Gagal menghapus program",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProgram) => {
    if (editingProgram) {
      updateMutation.mutate({ id: editingProgram.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    form.reset({
      name: program.name,
      description: program.description,
      startDate: program.startDate,
      endDate: program.endDate,
      status: program.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingProgram(null);
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { label: "Perencanaan", variant: "secondary" as const },
      running: { label: "Berjalan", variant: "default" as const },
      completed: { label: "Selesai", variant: "outline" as const },
      postponed: { label: "Ditunda", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16 ml-0 lg:ml-64 transition-all duration-300">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Program Kerja</h1>
          <p className="mt-2 text-gray-600">Tambah dan kelola program kerja OSIS</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Program
        </Button>
      </div>

      {/* Program Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingProgram ? "Edit Program Kerja" : "Tambah Program Kerja Baru"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Program</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama program" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planning">Perencanaan</SelectItem>
                            <SelectItem value="running">Sedang Berjalan</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                            <SelectItem value="postponed">Ditunda</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Mulai</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Selesai</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Program</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Jelaskan detail program kerja" 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingProgram ? "Perbarui" : "Simpan"} Program
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-full mb-4" />
                  <div className="h-8 bg-slate-200 rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : programs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(program)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(program.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(program.startDate).toLocaleDateString('id-ID')} - {new Date(program.endDate).toLocaleDateString('id-ID')}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  {getStatusBadge(program.status)}
                  <span className="text-xs text-gray-500">
                    Dibuat: {new Date(program.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Program Kerja</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Mulai tambahkan program kerja OSIS untuk mengelola kegiatan dengan lebih terorganisir.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Program Pertama
          </Button>
        </div>
      )}
    </div>
  );
}
