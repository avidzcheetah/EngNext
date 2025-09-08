import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageSquare,
  Building2,
  CheckCircle,
} from "lucide-react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "student",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call later)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        userType: "student",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "Faculty of Engineering,",
        "University of Jaffna,",
        "Ariviyal Nagar, Kilinochchi 44000",
        "Sri Lanka.",
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+94 21 222 8000 (Main)",
        "+94 21 222 8001 (EEE Dept)",
        "+94 77 123 4567 (Inturnix Support)",
      ],
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@eng.jfn.ac.lk",
        "eee@eng.jfn.ac.lk",
        "inturnix@eng.jfn.ac.lk",
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 4:30 PM",
        "Saturday: 8:00 AM - 12:00 PM",
        "Sunday: Closed",
        "Public Holidays: Closed",
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const quickLinks = [
    {
      title: "Student Registration",
      description: "Register as a student to find internships",
      link: "/register",
    },
    {
      title: "Company Registration",
      description: "Register your company to post internships",
      link: "/company/register",
    },
    {
      title: "Technical Support",
      description: "Get help with technical issues",
      link: "#",
    },
    {
      title: "Partnership Opportunities",
      description: "Explore partnership with University of Jaffna",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get In Touch
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100">
            Have questions about Inturnix? We're here to help students,
            companies, and partners succeed
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center mb-4`}
                >
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="userType"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        I am a *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          id="userType"
                          name="userType"
                          required
                          value={formData.userType}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="student">Student</option>
                          <option value="company">
                            Company Representative
                          </option>
                          <option value="academic">Academic Staff</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Message *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Please provide details about your inquiry..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Developers Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Meet the Developers
                </h3>

                <div className="flex flex-col gap-8">
                  {/* Developer 1 */}
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://media.licdn.com/dms/image/v2/D5603AQHc96-ENua_uA/profile-displayphoto-crop_800_800/B56ZffMhySG0AM-/0/1751796294656?e=1759968000&v=beta&t=7ix-p8zDkslvHG_Xd8aXrgb351De0ui4Tn0dP382TUA"
                      alt="Avidu Witharana"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Avidu Witharana
                      </h4>
                      <p className="text-sm text-gray-600">
                        Undergrad with a passion for Cybersecurity and Software Engineering. Currently contributing to various organizations and companies.
                      </p>
                      <div className="flex space-x-3 mt-2">
                        <a
                          href="https://www.linkedin.com/in/avidz/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://avidzverse.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Portfolio
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Developer 2 */}
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://media.licdn.com/dms/image/v2/D4D03AQHl06FEFwAWTQ/profile-displayphoto-shrink_800_800/B4DZQOZsHnHYAc-/0/1735408404012?e=1759968000&v=beta&t=RnNCIBtjmxPANVThTocVD3kd6E_3Hp5BykY_oKp6Ikk"
                      alt="Aakil Ahamed"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Aakil Ahamed
                      </h4>
                      <p className="text-sm text-gray-600">
                        A passionate Software Engineer with a strong interest in Cloud Computing, AI, ML, Deep Learning, and Embedded Systems.
                      </p>
                      <div className="flex space-x-3 mt-2">
                        <a
                          href="https://www.linkedin.com/in/aakil29a519311/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Map & Additional Info */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h3 className="font-semibold flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Find Us Here
                  </h3>
                  <p className="text-sm text-blue-100 mt-1">
                    University of Jaffna, Faculty of Engineering
                  </p>
                </div>
                <div className="h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.4100508048564!2d80.39923267478424!3d9.31372629075947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe96901581421d%3A0x3d3557c67d291156!2sFaculty%20Of%20Engineering%2C%20University%20of%20Jaffna!5e1!3m2!1sen!2slk!4v1757329557072!5m2!1sen!2slk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Faculty of Engineering
                      </p>
                      <p className="text-sm text-gray-600">
                        University of Jaffna
                      </p>
                      <p className="text-sm text-gray-600">
                        Ariviyal Nagar, Kilinochchi 44000, Sri Lanka
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="https://maps.app.goo.gl/eXCAt7LEKKEm8Wk57"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Open in Google Maps
                      </a>
                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText(
                            "Faculty of Engineering, University of Jaffna, Ariviyal Nagar, Kilinochchi 44000, Sri Lanka"
                          )
                        }
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        Copy Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      className="block p-4 border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group"
                    >
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {link.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "How do I register as a student on Inturnix?",
                answer:
                  "Students can register using their university email address (@eng.jfn.ac.lk). After registration, you'll need to verify your email before accessing the platform.",
              },
              {
                question:
                  "Can companies from outside Sri Lanka post internships?",
                answer:
                  "Yes, international companies are welcome to post internship opportunities. However, all postings need to be approved by our administrators before going live.",
              },
              {
                question: "What documents do I need to apply for internships?",
                answer:
                  "Students need to upload their CV (PDF format, max 3MB) and complete their profile information. Some companies may request additional documents during the application process.",
              },
              {
                question: "How are students and companies verified?",
                answer:
                  "Students are verified through their institutional email addresses. Companies go through a manual approval process by our administrators to ensure legitimacy.",
              },
              {
                question: "Is there any cost to use Inturnix?",
                answer:
                  "No, Inturnix is completely free for both students and companies. It's a service provided by the University of Jaffna to support student career development.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Our team is always ready to help you succeed in your internship
            journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:inturnix@eng.jfn.ac.lk"
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </a>
            <a
              href="tel:+94771234567"
              className="px-8 py-3 bg-white/10 border border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Support</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
