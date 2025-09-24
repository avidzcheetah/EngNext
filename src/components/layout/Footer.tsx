import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-blue-400" />
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
                <Phone className="w-5 h-5 text-blue-400" />
                <p className="text-sm">+94 76 0144977</p>
                <p className="text-sm">+94 71 0171111</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <p className="text-sm">engnextuoj@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="https://www.eng.jfn.ac.lk/" className="block text-sm hover:text-blue-400 transition-colors duration-200">
                Faculty of Engineering
              </a>
              <a href="https://www.jfn.ac.lk/" className="block text-sm hover:text-blue-400 transition-colors duration-200">
                University of Jaffna
              </a>
              <a href="https://www.eng.jfn.ac.lk/core-structure-of-the-degree-program-3/" className="block text-sm hover:text-blue-400 transition-colors duration-200">
                Academic Curriculum
              </a>
            </div>
          </div>

          {/* University Logo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">University of Jaffna</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <img
                  src= "https://www.jfn.ac.lk/wp-content/uploads/2022/02/Logo-Color-300x300.png"
                  alt= "UoJ logo"
                />
              </div>
              <div>
                <p className="font-semibold">Faculty of Engineering</p>
                <p className="text-sm text-gray-400">Excellence in Engineering Education</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Empowering future engineers through innovative education and research.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Faculty of Engineering, University of Jaffna. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Made with ❤️ by <a href="https://avidzverse.vercel.app" className="text-blue-400 font-semibold">Avidu Witharana</a> & <a href="https://www.linkedin.com/in/aakil29a519311/" className="text-blue-400 font-semibold">Aakil Ahamed</a> 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;