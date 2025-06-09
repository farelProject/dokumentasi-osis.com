import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, X, FileImage, FileVideo, Upload } from "lucide-react";
import { z } from "zod";
import { Link } from "wouter";

const uploadFormSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori harus dipilih"),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

interface FileWithProgress {
  file: File;
  progress: number;
  id: string;
}

export default function AdminUpload() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { formData: FormData; files: FileWithProgress[] }) => {
      setIsUploading(true);
      
      // Simulate upload progress for each file
      const uploadPromises = data.files.map((fileWithProgress, index) => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              resolve(fileWithProgress);
            }
            
            setSelectedFiles(prev => 
              prev.map(f => 
                f.id === fileWithProgress.id 
                  ? { ...f, progress: Math.round(progress) }
                  : f
              )
            );
          }, 200);
        });
      });

      // Wait for all progress animations to complete
      await Promise.all(uploadPromises);

      // Actually upload the files
      const response = await fetch("/api/media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data.formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload berhasil!",
        description: "Media telah ditambahkan ke koleksi.",
      });
      
      // Reset form and files
      form.reset();
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
    onError: () => {
      toast({
        title: "Upload gagal",
        description: "Terjadi kesalahan saat mengupload file.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        file,
        progress: 0,
        id: Math.random().toString(36).substring(7),
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: UploadFormData) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Pilih file terlebih dahulu!",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(fileWithProgress => {
      formData.append('files', fileWithProgress.file);
    });
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('category', data.category);

    uploadMutation.mutate({ formData, files: selectedFiles });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16 ml-0 lg:ml-64 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
        <p className="mt-2 text-gray-600">Upload foto dan video dokumentasi kegiatan OSIS</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Upload File</label>
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                      <CloudUpload className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Pilih file untuk diupload</p>
                      <p className="text-sm text-gray-500">atau drag & drop file di sini</p>
                    </div>
                    <Button type="button" variant="outline">
                      Pilih File
                    </Button>
                    <p className="text-xs text-gray-400">Format yang didukung: JPG, PNG, MP4, AVI (Max 50MB per file)</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* File Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">File yang dipilih:</h3>
                  <div className="space-y-2">
                    {selectedFiles.map((fileWithProgress) => (
                      <div key={fileWithProgress.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          {fileWithProgress.file.type.startsWith('image/') ? (
                            <FileImage className="h-5 w-5 text-primary mr-3" />
                          ) : (
                            <FileVideo className="h-5 w-5 text-primary mr-3" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{fileWithProgress.file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(fileWithProgress.file.size)}</p>
                            {isUploading && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Uploading...</span>
                                  <span>{fileWithProgress.progress}%</span>
                                </div>
                                <Progress value={fileWithProgress.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                        {!isUploading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(fileWithProgress.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Details */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan judul media" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kegiatan-sekolah">Kegiatan Sekolah</SelectItem>
                          <SelectItem value="program-kerja">Program Kerja</SelectItem>
                          <SelectItem value="event-khusus">Event Khusus</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan deskripsi media" 
                        rows={4} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Link href="/admin/dashboard">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={isUploading || selectedFiles.length === 0}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Mengupload..." : "Upload Media"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
