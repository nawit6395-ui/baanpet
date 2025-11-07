import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateReport, useReports } from "@/hooks/useReports";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

const reportSchema = z.object({
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  district: z.string().trim().min(1, "กรุณากรอกเขต/อำเภอ").max(100, "เขต/อำเภอต้องไม่เกิน 100 ตัวอักษร"),
  location: z.string().trim().min(1, "กรุณากรอกสถานที่").max(200, "สถานที่ต้องไม่เกิน 200 ตัวอักษร"),
  description: z.string().max(1000, "รายละเอียดต้องไม่เกิน 1000 ตัวอักษร").optional(),
});

const Report = () => {
  const { user } = useAuth();
  const { data: reports } = useReports();
  const createReport = useCreateReport();
  
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      const validatedData = reportSchema.parse({
        province,
        district,
        location,
        description,
      });

      await createReport.mutateAsync({
        province: validatedData.province,
        district: validatedData.district,
        location: validatedData.location,
        description: validatedData.description || undefined,
        cat_count: 1,
        status: 'pending',
        user_id: user.id,
      });

      setProvince("");
      setDistrict("");
      setLocation("");
      setDescription("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-prompt">แจ้งเจอแมวจร 📍</h1>
          <p className="text-muted-foreground font-prompt">ช่วยกันบันทึกข้อมูลแมวจรในพื้นที่</p>
        </div>

        <Card className="p-6 shadow-card mb-8">
          {!user && (
            <div className="mb-4 p-4 bg-accent/10 border border-accent rounded-lg">
              <p className="text-sm font-prompt text-center">
                🐾 <Link to="/login" className="font-semibold text-primary hover:underline">เข้าสู่ระบบ</Link> เพื่อแจ้งเจอแมวจรในพื้นที่ของคุณ
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="province" className="font-prompt">จังหวัด *</Label>
              <Select value={province} onValueChange={setProvince} required>
                <SelectTrigger className="font-prompt"><SelectValue placeholder="เลือกจังหวัด" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="กรุงเทพมหานคร" className="font-prompt">กรุงเทพมหานคร</SelectItem>
                  <SelectItem value="เชียงใหม่" className="font-prompt">เชียงใหม่</SelectItem>
                  <SelectItem value="ภูเก็ต" className="font-prompt">ภูเก็ต</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="font-prompt">เขต/อำเภอ *</Label>
              <Input value={district} onChange={(e) => setDistrict(e.target.value)} required className="font-prompt" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-prompt">สถานที่ *</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required className="font-prompt" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-prompt">รายละเอียด</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="font-prompt" />
            </div>

            <Button type="submit" className="w-full font-prompt gap-2" disabled={createReport.isPending}>
              <Send className="w-4 h-4" />
              {createReport.isPending ? "กำลังส่ง..." : "ส่งรายงาน"}
            </Button>
          </form>
        </Card>

        {reports && reports.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 font-prompt">รายงานล่าสุด</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.slice(0, 3).map((report) => (
                <Card key={report.id} className="p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1 font-prompt">พบแมวจร {report.cat_count} ตัว</h3>
                      <p className="text-sm text-muted-foreground font-prompt">{report.location}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
