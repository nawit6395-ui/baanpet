import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useUpdateUrgentCase } from "@/hooks/useUrgentCases";
import { ImageGallery } from "./ImageGallery";
import { toast } from "sonner";

interface UrgentCaseCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  province: string;
  image_url?: string[];
  contact_name: string;
  contact_phone: string;
  contact_line?: string;
  case_type: 'injured' | 'sick' | 'kitten' | 'other';
  is_resolved: boolean;
  user_id: string;
  created_at: string;
}

const caseTypeLabels = {
  injured: "บาดเจ็บ",
  sick: "ป่วย",
  kitten: "ลูกแมว",
  other: "อื่นๆ"
};

const caseTypeColors = {
  injured: "bg-red-500",
  sick: "bg-orange-500",
  kitten: "bg-blue-500",
  other: "bg-gray-500"
};

export const UrgentCaseCard = ({
  id,
  title,
  description,
  location,
  province,
  image_url,
  contact_name,
  contact_phone,
  contact_line,
  case_type,
  is_resolved,
  user_id,
  created_at,
}: UrgentCaseCardProps) => {
  const [showContact, setShowContact] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const updateUrgentCase = useUpdateUrgentCase();

  const isOwner = user?.id === user_id;
  const canManage = isOwner || isAdmin;

  const getTimeSince = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diffInMinutes / 1440)} วันที่แล้ว`;
  };

  const handleMarkAsResolved = async () => {
    await updateUrgentCase.mutateAsync({
      id,
      is_resolved: true,
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-40 sm:h-48 bg-muted">
          {image_url && image_url.length > 0 ? (
            <>
              <img
                src={image_url[0]}
                alt={title}
                className="w-full h-full object-cover"
              />
              {image_url.length > 1 && (
                <div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                  onClick={() => setGalleryOpen(true)}
                >
                  <div className="text-white text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-prompt">ดูรูปทั้งหมด {image_url.length} รูป</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Status Badge */}
          {is_resolved && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg font-prompt px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                ได้รับการช่วยเหลือแล้ว
              </Badge>
            </div>
          )}

          {/* Case Type Badge */}
          <Badge className={`absolute top-2 right-2 ${caseTypeColors[case_type]} text-white font-prompt text-xs px-2 py-0.5`}>
            {caseTypeLabels[case_type]}
          </Badge>
        </div>

        <CardHeader className="p-2 sm:p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="font-prompt text-sm sm:text-base truncate">{title}</CardTitle>
              <CardDescription className="font-prompt flex items-center gap-1 mt-0.5 text-xs">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{location}, {province}</span>
              </CardDescription>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-prompt whitespace-nowrap">
              {getTimeSince(created_at)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 p-2 pt-0 sm:p-3">
          <p className="text-xs sm:text-sm text-muted-foreground font-prompt line-clamp-2">
            {description}
          </p>

          {/* Contact Information */}
          {!showContact ? (
            <Button
              onClick={() => {
                if (!user) {
                  toast.error('กรุณาเข้าสู่ระบบเพื่อดูข้อมูลติดต่อ');
                  return;
                }
                setShowContact(true);
              }}
              variant="outline"
              size="sm"
              className="w-full font-prompt text-xs h-7 sm:h-8"
            >
              ดูข้อมูลติดต่อ
            </Button>
          ) : (
            <div className="space-y-1 p-2 bg-muted rounded-lg">
              <p className="font-prompt text-[10px] sm:text-xs">
                <strong>ผู้ติดต่อ:</strong> {contact_name}
              </p>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <a
                  href={`tel:${contact_phone}`}
                  className="text-xs text-primary hover:underline font-prompt"
                >
                  {contact_phone}
                </a>
              </div>
              {contact_line && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span className="text-xs font-prompt">Line: {contact_line}</span>
                </div>
              )}
            </div>
          )}

          {/* Management Buttons */}
          {canManage && !is_resolved && (
            <div className="pt-1 border-t">
              <Button
                onClick={handleMarkAsResolved}
                variant="default"
                size="sm"
                className="w-full font-prompt text-[10px] sm:text-xs h-7 sm:h-8"
                disabled={updateUrgentCase.isPending}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">ได้รับการช่วยเหลือแล้ว</span>
                <span className="sm:hidden">แก้ไขแล้ว</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {image_url && image_url.length > 0 && (
        <ImageGallery
          images={image_url}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
        />
      )}
    </>
  );
};
