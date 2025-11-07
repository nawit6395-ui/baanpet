import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePost } from '@/hooks/useForumPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(5, 'หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร').max(200, 'หัวข้อต้องไม่เกิน 200 ตัวอักษร'),
  content: z.string().min(10, 'เนื้อหาต้องมีอย่างน้อย 10 ตัวอักษร').max(5000, 'เนื้อหาต้องไม่เกิน 5000 ตัวอักษร'),
  category: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
});

const categories = [
  { value: 'general', label: 'ทั่วไป' },
  { value: 'adoption', label: 'การรับเลี้ยง' },
  { value: 'health', label: 'สุขภาพ' },
  { value: 'behavior', label: 'พฤติกรรม' },
  { value: 'nutrition', label: 'อาหารและโภชนาการ' },
];

const CreateForumPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createPost = useCreatePost();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนสร้างกระทู้');
      navigate('/login');
      return;
    }

    // Validate form data
    try {
      postSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
        return;
      }
    }

    createPost.mutate(
      {
        ...formData,
        user_id: user.id,
      },
      {
        onSuccess: () => {
          navigate('/forum');
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/forum')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        กลับไปเว็บบอร์ด
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">สร้างกระทู้ใหม่</CardTitle>
          <CardDescription>แบ่งปันความคิดเห็นหรือถามคำถามกับชุมชน</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">หมวดหมู่ *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">หัวข้อ *</Label>
              <Input
                id="title"
                placeholder="ใส่หัวข้อกระทู้ของคุณ"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/200 ตัวอักษร
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">เนื้อหา *</Label>
              <Textarea
                id="content"
                placeholder="เขียนรายละเอียดกระทู้ของคุณ..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                maxLength={5000}
                required
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.content.length}/5000 ตัวอักษร
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={createPost.isPending}
                className="flex-1"
              >
                {createPost.isPending ? 'กำลังสร้างกระทู้...' : 'สร้างกระทู้'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/forum')}
                className="flex-1"
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForumPost;
