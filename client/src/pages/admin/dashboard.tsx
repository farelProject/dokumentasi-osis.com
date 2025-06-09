import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Images, Video, Calendar, Eye, Upload, Plus, FolderOpen, ChevronRight } from "lucide-react";
import type { Media, Program } from "@shared/schema";

export default function AdminDashboard() {
  const { data: media = [] } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const totalPhotos = media.filter(m => m.mimeType.startsWith('image/')).length;
  const totalVideos = media.filter(m => m.mimeType.startsWith('video/')).length;
  const activePrograms = programs.filter(p => p.status === 'running').length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16 ml-0 lg:ml-64 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="mt-2 text-gray-600">Kelola dokumentasi dan program kerja OSIS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Images className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Foto</p>
                <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-6 w-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Video</p>
                <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Program Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{activePrograms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Media</p>
                <p className="text-2xl font-bold text-gray-900">{media.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/upload">
              <Button variant="outline" className="w-full justify-between h-auto p-3">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-primary mr-3" />
                  <span className="font-medium">Upload Media Baru</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Button>
            </Link>
            
            <Link href="/admin/programs">
              <Button variant="outline" className="w-full justify-between h-auto p-3">
                <div className="flex items-center">
                  <Plus className="h-5 w-5 text-accent mr-3" />
                  <span className="font-medium">Tambah Program Kerja</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Button>
            </Link>
            
            <Link href="/admin/media">
              <Button variant="outline" className="w-full justify-between h-auto p-3">
                <div className="flex items-center">
                  <FolderOpen className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="font-medium">Kelola Media</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {media.length > 0 || programs.length > 0 ? (
              <div className="space-y-3">
                {media.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {item.mimeType.startsWith('image/') ? (
                        <Images className="h-4 w-4 text-primary" />
                      ) : (
                        <Video className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-gray-500">
                        {new Date(item.uploadedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
                {programs.slice(0, 2).map((program) => (
                  <div key={program.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{program.name}</p>
                      <p className="text-gray-500">
                        {new Date(program.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Belum ada aktivitas</p>
                <p className="text-xs mt-1">Aktivitas akan muncul setelah Anda mulai mengelola konten</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
