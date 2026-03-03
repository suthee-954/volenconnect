import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/70 to-emerald-800/70 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Preserving Our Planet Through Volunteer Action
            </h1>
            <p className="text-xl mb-8 text-emerald-100">
              Join our community of eco-warriors and make a real impact on environmental conservation. Together, we can protect our planet's precious ecosystems.
            </p>
            <div className="flex gap-4">
              <Link
                to="/tasks"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/search"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-emerald-900 transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Make an Impact</h3>
              <p className="text-gray-600">
                Contribute to conservation projects and help protect our planet's vital ecosystems.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Join the Community</h3>
              <p className="text-gray-600">
                Connect with like-minded volunteers and organizations dedicated to environmental causes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Earn certificates and track your contribution to environmental conservation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="py-20 px-6 bg-emerald-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Conservation Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Rainforest"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2"> Reforestation</h3>
                  <p className="text-emerald-100">Help plant trees and restore damaged rainforest areas</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Wildlife"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Wildlife Protection</h3>
                  <p className="text-emerald-100">Support endangered species conservation efforts</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1550236520-7050f3582da0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Community"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Community Education</h3>
                  <p className="text-emerald-100">Teach local communities about conservation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of volunteers and start contributing to environmental conservation projects today.
          </p>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}