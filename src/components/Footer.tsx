import { Heart, Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <Heart className="w-6 h-6 fill-primary" />
              <span className="font-prompt">CatHome Community</span>
            </div>
            <p className="text-sm text-muted-foreground font-prompt">
              ชุมชนช่วยเหลือแมวจรในประเทศไทย<br />
              ร่วมกันหาบ้านให้แมว ลดปัญหาแมวจรจัด
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-prompt">เมนูหลัก</h3>
            <ul className="space-y-2 text-sm font-prompt">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link to="/adopt" className="text-muted-foreground hover:text-primary transition-colors">
                  หาบ้านให้แมว
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-muted-foreground hover:text-primary transition-colors">
                  แจ้งเจอแมวจร
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-muted-foreground hover:text-primary transition-colors">
                  ความรู้
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-prompt">ติดตามเรา</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground font-prompt">
              ⚠️ เว็บไซต์นี้ไม่อนุญาตให้มีการซื้อขายสัตว์
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground font-prompt">
          © 2024 CatHome Community. ทำด้วยความรักเพื่อน้องแมวทุกตัว ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;
