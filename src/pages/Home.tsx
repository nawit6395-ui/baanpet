import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MapPin, Heart, TrendingUp } from "lucide-react";
import CatCard from "@/components/CatCard";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-cat-pastel.jpg";
import { useCats } from "@/hooks/useCats";
import { useReports } from "@/hooks/useReports";

const Home = () => {
  const { data: cats } = useCats();
  const { data: reports } = useReports();

  const urgentCats = cats?.filter(cat => cat.is_urgent && !cat.is_adopted).slice(0, 3) || [];
  const totalAdopted = cats?.filter(cat => cat.is_adopted).length || 0;
  const totalAvailable = cats?.filter(cat => !cat.is_adopted).length || 0;
  const totalReports = reports?.length || 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-soft overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm opacity-5"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-primary font-prompt">ชุมชนคนรักแมว</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground font-prompt leading-tight">
                ช่วยแมวจร
                <span className="text-primary"> ให้ได้บ้าน</span>
                ที่อบอุ่น 🐾
              </h1>
              <p className="text-xl text-muted-foreground font-prompt leading-relaxed">
                ร่วมเป็นส่วนหนึ่งของชุมชนที่ใส่ใจแมวจร
                ช่วยกันหาบ้านที่อบอุ่น ลดปัญหาแมวจรจัดในเมือง
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/adopt">
                  <Button size="lg" className="font-prompt gap-2 text-base px-8 h-14 shadow-hover hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                    หาแมวรับเลี้ยง
                  </Button>
                </Link>
                <Link to="/add-cat">
                  <Button size="lg" variant="outline" className="font-prompt gap-2 text-base px-8 h-14 hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5" />
                    ลงประกาศหาบ้านให้แมว
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-warm opacity-20 rounded-[3rem] blur-2xl"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-hover border-4 border-white/50">
                <img 
                  src={heroImage}
                  alt="น้องแมวน่ารักในบ้านที่อบอุ่น" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card rounded-3xl shadow-card px-8 py-6 border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 p-3 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground font-prompt">{totalAdopted}+</div>
                    <div className="text-sm text-muted-foreground font-prompt">แมวหาบ้านเจอแล้ว</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 text-center shadow-card">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 font-prompt">{totalAdopted}</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-prompt">แมวหาบ้านเจอแล้ว</div>
            </Card>
            <Card className="p-4 sm:p-6 text-center shadow-card">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 font-prompt">{totalAvailable}</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-prompt">แมวรอรับเลี้ยง</div>
            </Card>
            <Card className="p-4 sm:p-6 text-center shadow-card">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 font-prompt">{totalReports}</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-prompt">จุดแมวจร</div>
            </Card>
            <Card className="p-4 sm:p-6 text-center shadow-card">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 font-prompt">{urgentCats.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-prompt">กรณีด่วน</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Urgent Adoption Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-prompt">แมวหาบ้านด่วน 🆘</h2>
              <p className="text-muted-foreground font-prompt">น้องแมวเหล่านี้กำลังรอคุณอยู่</p>
            </div>
            <Link to="/adopt">
              <Button variant="outline" className="font-prompt gap-2">
                ดูทั้งหมด
                <TrendingUp className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {urgentCats && urgentCats.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {urgentCats.map((cat) => (
              <CatCard 
                key={cat.id}
                id={cat.id}
                name={cat.name}
                age={cat.age}
                province={cat.province}
                district={cat.district}
                images={cat.image_url}
                story={cat.story}
                gender={cat.gender}
                isAdopted={cat.is_adopted}
                urgent={cat.is_urgent}
                contactName={cat.contact_name}
                contactPhone={cat.contact_phone}
                contactLine={cat.contact_line}
                userId={cat.user_id}
                healthStatus={cat.health_status}
                isSterilized={cat.is_sterilized}
              />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl p-8">
              <p className="text-lg text-muted-foreground font-prompt mb-4">
                🐾 ยังไม่มีกรณีด่วนในขณะนี้
              </p>
              <p className="text-sm text-muted-foreground font-prompt mb-6">
                ดูแมวทั้งหมดที่รอรับเลี้ยงได้ในหน้าหาบ้านให้แมว
              </p>
              <a href="/adopt">
                <Button className="font-prompt">ดูแมวทั้งหมด</Button>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 font-prompt">แผนที่จุดพบเจอแมวจร 🗺️</h2>
            <p className="text-muted-foreground font-prompt">ช่วยกันดูแลแมวจรในพื้นที่ของคุณ</p>
          </div>
          
          <Card className="overflow-hidden shadow-hover">
            <div className="bg-muted h-96 flex items-center justify-center relative">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-primary mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 font-prompt">แผนที่แบบโต้ตอบ</h3>
                  <p className="text-muted-foreground mb-4 font-prompt">แสดงจุดพบเจอแมวจรทั่วประเทศ</p>
                  <Link to="/report">
                    <Button className="font-prompt">
                      ดูแผนที่เต็ม
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-warm text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-prompt">พร้อมที่จะเริ่มต้นแล้วหรือยัง?</h2>
          <p className="text-lg mb-8 opacity-90 font-prompt">
            ร่วมเป็นส่วนหนึ่งในการช่วยเหลือแมวจร สร้างความเปลี่ยนแปลงที่ดีต่อชีวิตน้องแมว
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/adopt">
              <Button size="lg" variant="secondary" className="font-prompt gap-2">
                <Heart className="w-5 h-5" />
                เริ่มหาแมวรับเลี้ยง
              </Button>
            </Link>
            <Link to="/add-cat">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-prompt gap-2">
                <Plus className="w-5 h-5" />
                ลงประกาศหาบ้าน
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
