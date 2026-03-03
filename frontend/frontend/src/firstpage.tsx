import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, ArrowRight, LogIn } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white"> {/* Dark navy background */}

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-[#1E293B]/90 backdrop-blur-md text-white py-4 px-6 flex justify-between items-center z-50 shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide text-[#E879F9]">VOLUNCONNECT</h1> {/* Bright purple accent */}
        <Link 
          to="/login-selection"
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#A78BFA] text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <LogIn className="w-5 h-5" />
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center mt-16"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Preserving Our Planet Through Volunteer Action
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Join our community of eco-warriors and make a real impact on environmental conservation.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login-selection"
                className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {[{
            icon: <Heart className="w-6 h-6 text-[#A78BFA]" />,
            title: "Make an Impact",
            description: "Contribute to conservation projects and help protect our planet's vital ecosystems."
          }, {
            icon: <Users className="w-6 h-6 text-[#A78BFA]" />,
            title: "Join the Community",
            description: "Connect with like-minded volunteers and organizations dedicated to environmental causes."
          }, {
            icon: <Award className="w-6 h-6 text-[#A78BFA]" />,
            title: "Track Progress",
            description: "Earn certificates and track your contribution to environmental conservation."
          }].map((feature, index) => (
            <div key={index} className="bg-[#1E293B] rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#334155]/50 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Conservation Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Reforestation", desc: "Help plant trees and restore damaged rainforest areas", img: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Wildlife Protection", desc: "Support endangered species conservation efforts", img: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            ].map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl">
                <img 
                  src={project.img}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-purple-100">{project.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our community of volunteers and start contributing to environmental conservation projects today.
          </p>
          <Link
            to="/login-selection"
            className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#A78BFA] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
