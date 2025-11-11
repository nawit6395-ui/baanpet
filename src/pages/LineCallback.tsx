import { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { handleLineCallback } from '@/integrations/line/client';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const LineCallback = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const processLineCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          toast.error('ไม่สามารถเข้าสู่ระบบได้', {
            description: 'ไม่ได้รับรหัสจาก LINE'
          });
          setIsLoading(false);
          return;
        }

        // Get LINE user info
        const lineUserInfo = await handleLineCallback(code, state || '');

        // Try to sign in with Supabase using the LINE user ID as email
        const lineEmail = `line_${lineUserInfo.userId}@baanpet.app`;

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: lineEmail,
          password: lineUserInfo.userId, // Use LINE user ID as password
        });

        if (signInError && signInError.status === 400) {
          // User doesn't exist, create new account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: lineEmail,
            password: lineUserInfo.userId,
            options: {
              data: {
                full_name: lineUserInfo.displayName,
                picture_url: lineUserInfo.pictureUrl,
                line_user_id: lineUserInfo.userId,
              }
            }
          });

          if (signUpError) throw signUpError;

          toast.success('สมัครสมาชิกสำเร็จ!', {
            description: 'ยินดีต้อนรับสู่ CatHome'
          });
        } else if (signInError) {
          throw signInError;
        }

        toast.success('เข้าสู่ระบบสำเร็จ!', {
          description: `ยินดีต้อนรับ ${lineUserInfo.displayName}`
        });

        setRedirected(true);
      } catch (error: any) {
        console.error('Error processing LINE callback:', error);
        toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', {
          description: error.message || 'โปรดลองอีกครั้ง'
        });
        setIsLoading(false);
      }
    };

    processLineCallback();
  }, [searchParams]);

  if (user && redirected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full p-8 shadow-hover text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="w-8 h-8 fill-primary text-primary animate-pulse" />
          <span className="text-2xl font-bold font-prompt">CatHome</span>
        </div>
        <h1 className="text-xl font-bold mb-4 font-prompt">กำลังเข้าสู่ระบบ...</h1>
        <p className="text-muted-foreground font-prompt">
          กำลังตรวจสอบข้อมูลของคุณ โปรดรอสักครู่
        </p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    </div>
  );
};

export default LineCallback;
