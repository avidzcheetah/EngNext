import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-brand-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">
                    Faculty of Engineering<br />
                    University of Jaffna<br />
                    Ariviyal Nagar, Kilinochchi 44000<br />
                    Sri Lanka
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <p className="text-sm">+94 76 0144977</p>
                <p className="text-sm">+94 71 0171111</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <p className="text-sm">engnextuoj@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="https://www.eng.jfn.ac.lk/" className="block text-sm hover:text-brand-400 hover:translate-x-1 transition-all duration-300">
                Faculty of Engineering
              </a>
              <a href="https://www.jfn.ac.lk/" className="block text-sm hover:text-brand-400 hover:translate-x-1 transition-all duration-300">
                University of Jaffna
              </a>
              <a href="https://www.eng.jfn.ac.lk/core-structure-of-the-degree-program-3/" className="block text-sm hover:text-brand-400 hover:translate-x-1 transition-all duration-300">
                Academic Curriculum
              </a>
            </div>
          </div>

          {/* University Logo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">University of Jaffna</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-slate-800">
                <img
                  src="https://res.cloudinary.com/ayba9tzb/image/upload/v1784449248/engnext_assets/dgnlrw4rqttj6w9lirdj.png"
                  alt="UoJ logo"
                  className="w-full h-full object-cover scale-[1.05]"
                />
              </div>
              <div>
                <p className="font-semibold text-white">Faculty of Engineering</p>
                <p className="text-sm text-slate-400">Excellence in Engineering Education</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Empowering future engineers through innovative education and research.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p className="text-center sm:text-left">
            © 2026 Faculty of Engineering, University of Jaffna. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Built by{" "}
            <a
              href="https://avidz.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="shine-hover"
            >
              AVIDZ
            </a>{" "}
            &{" "}
            <a
              href="https://www.linkedin.com/in/aakil29a519311/"
              target="_blank"
              rel="noopener noreferrer"
              className="shine-hover"
            >
              AAKIL
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;