import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Search, Images, Video, Play } from "lucide-react";
import { Link } from "wouter";
import type { Media } from "@shared/schema";

export default function Collection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const { data: media = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media", { search, category, type }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (type) params.append("type", type);
      
      const response = await fetch(`/api/media?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch media");
      return response.json();
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Koleksi Dokumentasi</h1>
        <p className="mt-2 text-gray-600">Jelajahi foto dan video kegiatan OSIS SMKN 5 Bulukumba</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Cari dokumentasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Tipe</SelectItem>
              <SelectItem value="image">Foto</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Kategori</SelectItem>
              <SelectItem value="kegiatan-sekolah">Kegiatan Sekolah</SelectItem>
              <SelectItem value="program-kerja">Program Kerja</SelectItem>
              <SelectItem value="event-khusus">Event Khusus</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-slate-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-slate-200 relative group">
                {item.mimeType.startsWith('image/') ? (
                  <img 
                    src={`/api/uploads/${item.filename}`} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Video</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(`/api/uploads/${item.filename}`, '_blank')}
                  >
                    Lihat
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span className="capitalize">{item.category.replace('-', ' ')}</span>
                  <span>{formatFileSize(item.size)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Images className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {search || category || type ? "Tidak Ada Hasil" : "Belum Ada Dokumentasi"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {search || category || type 
              ? "Coba ubah kata kunci pencarian atau filter untuk mendapatkan hasil yang berbeda."
              : "Koleksi dokumentasi masih kosong. Admin dapat menambahkan foto dan video melalui panel admin."
            }
          </p>
          <Link href="/admin/login">
            <Button>
              Login Admin
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
