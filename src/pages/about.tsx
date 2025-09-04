import React from 'react';
import { Users, Briefcase, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Inturnix</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100">
            Bridging the gap between Engineering Students and Industry Leaders
          </p>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              The Faculty of Engineering, University of Jaffna,
              developed Inturnix to create a seamless online connection between Engineering students
              and industry partners. We aim to streamline the internship search, application,
              and recruitment processes with an intuitive, secure, and interactive platform.
            </p>
            <p className="text-gray-600">
              By using institutional verification, modern communication tools, and smart
              recruitment features, Inturnix empowers students to showcase their talents and
              companies to find the best emerging professionals in the field.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://i.ibb.co/C3bM032v/78774494-117352396407464-1797319693116112896-n.jpg"
              alt="University of Jaffna Engineering"
              className="rounded-xl shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Stats / Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">What Makes Us Different</h2>

          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Student-Focused</h3>
              <p className="text-gray-600 text-sm">Built for Engineering students to highlight skills and secure opportunities.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
              <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Industry Connections</h3>
              <p className="text-gray-600 text-sm">Directly connect with leading companies and recruiters.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Verified</h3>
              <p className="text-gray-600 text-sm">Institutional email verification for trusted networking.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">Encouraging skill growth and rewarding top performers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <img
              src="https://i.ibb.co/gFcTTpXv/480217173-605054155817425-3641545989452124133-n.jpg"
              alt="Kilinochchi Premises"
              className="rounded-xl shadow-lg border border-gray-200"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              Our vision is to be the leading platform in Sri Lanka for engineering internships,
              fostering innovation, collaboration, and professional growth. By bridging
              academia and industry, we aim to prepare graduates who not only excel technically
              but also lead with integrity and adaptability.
            </p>
            <p className="text-gray-600">
              Inturnix strives to embrace emerging technologies, enabling a smarter,
              data-driven approach to career development and talent acquisition.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Join the Inturnix Community</h2>
          <p className="mb-6 text-blue-100">
            Whether you’re a student ready to showcase your skills or a company looking for
            top talent, Inturnix provides the tools to connect, collaborate, and succeed.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;