import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, Building2, Award, Globe } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Slider from '../components/ui/slider';
import { lecturers, partners } from '../data/mockData';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Slider Section */}
      <section className="bg-white">
        <Slider />
      </section>


      {/* About EEE Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Faculty of Engineering
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Excellence in engineering education and research at the University of Jaffna's Faculty of Engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                The Faculty of Engineering is committed to providing world-class education and fostering 
                innovation in Electrical and Electronic Engineering, Computer Engineering, Mechanical Engineering 
                and Civil Engineering. We prepare our students to become leaders in their fields through 
                comprehensive academic programs and hands-on research opportunities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Cutting-edge curriculum aligned with industry needs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">State-of-the-art laboratories and research facilities</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Strong industry partnerships and internship programs</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="EEE Laboratory" 
                  className="rounded-lg shadow-lg"
                />
                <img 
                  src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Engineering Equipment" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Students Working" 
                  className="rounded-lg shadow-lg"
                />
                <img 
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Research Lab" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Distinguished Faculty</h2>
            <p className="text-xl text-gray-600">
              Learn from industry experts and renowned academics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lecturers.map((lecturer) => (
              <Card key={lecturer.id} className="p-6 text-center">
                <img
                  src={lecturer.photo}
                  alt={lecturer.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{lecturer.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-2">{lecturer.title}</p>
                <p className="text-gray-600 text-sm">{lecturer.specialization}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Industry Partners</h2>
            <p className="text-xl text-gray-600">
              Collaborating with leading companies to create opportunities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <Card key={partner.id} className="p-6 text-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 w-auto mx-auto mb-4 object-contain"
                />
                <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/companies">
              <Button size="lg">
                View All Partners <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join hundreds of EEE students who have found their perfect internship match through Inturnix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/student">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Register as Student
              </Button>
            </Link>
            <Link to="/register/company">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Register as Company
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;