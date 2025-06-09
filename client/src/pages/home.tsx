import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Images, Video, Calendar, Users, Lightbulb, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Media, Program } from "@shared/schema";

export default function Home() {
  const { data: recentMedia = [] } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const { data: recentPrograms = [] } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const latestMedia = recentMedia.slice(0, 3);
  const latestPrograms = recentPrograms.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative gradient-primary text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            OSIS SMKN 5 Bulukumba
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Organisasi Siswa Intra Sekolah yang berkomitmen untuk mengembangkan potensi siswa melalui berbagai program kerja dan kegiatan yang positif.
          </p>
          <div className="mt-10">
            <Link href="/collection">
              <Button size="lg" variant="secondary" className="text-lg">
                Jelajahi Dokumentasi
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Tentang OSIS</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              OSIS SMKN 5 Bulukumba adalah wadah untuk mengembangkan kepemimpinan, kreativitas, dan karakter siswa melalui berbagai kegiatan yang bermanfaat.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <Users className="text-white h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Kepemimpinan</h3>
              <p className="mt-2 text-gray-600">Mengembangkan jiwa kepemimpinan melalui berbagai program dan kegiatan organisasi.</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto">
                <Lightbulb className="text-white h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Kreativitas</h3>
              <p className="mt-2 text-gray-600">Menyalurkan kreativitas siswa melalui berbagai event dan kompetisi yang menarik.</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto">
                <Heart className="text-white h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Karakter</h3>
              <p className="mt-2 text-gray-600">Membentuk karakter positif dan nilai-nilai moral yang kuat pada setiap siswa.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documentation */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Dokumentasi Terbaru</h2>
            <p className="mt-4 text-lg text-gray-600">Beberapa momen terbaik dari kegiatan OSIS</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestMedia.length > 0 ? (
              latestMedia.map((media) => (
                <Card key={media.id} className="overflow-hidden">
                  <div className="h-48 bg-slate-200 flex items-center justify-center">
                    {media.mimeType.startsWith('image/') ? (
                      <img 
                        src={`/api/uploads/${media.filename}`} 
                        alt={media.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-500">
                        <Video className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Video</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{media.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{media.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-slate-200 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      {index === 0 && <Images className="h-12 w-12 mx-auto mb-2" />}
                      {index === 1 && <Video className="h-12 w-12 mx-auto mb-2" />}
                      {index === 2 && <Calendar className="h-12 w-12 mx-auto mb-2" />}
                      <p className="text-sm">Belum ada dokumentasi</p>
                      <p className="text-xs mt-1">Admin dapat menambahkan melalui panel admin</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {index === 0 && "Kegiatan OSIS"}
                      {index === 1 && "Video Kegiatan"}
                      {index === 2 && "Program Kerja"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {index === 0 && "Dokumentasi kegiatan akan ditampilkan di sini"}
                      {index === 1 && "Video dokumentasi akan ditampilkan di sini"}
                      {index === 2 && "Daftar program kerja akan ditampilkan di sini"}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/collection">
              <Button size="lg">
                Lihat Semua Dokumentasi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
