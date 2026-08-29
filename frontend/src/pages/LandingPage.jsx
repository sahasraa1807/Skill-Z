import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 py-20 flex-1 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Find the right project.<br className="hidden sm:block" /> Find the right people. <br className="hidden sm:block" />
            <span className="text-primary-600">Build something together.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
            Skillz matches developers, designers, and creators based on skills, interests, and availability. Stop searching endlessly and start building.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg text-lg hover:bg-primary-700 transition-colors">
              Find a Project
            </Link>
            <Link to="/signup" className="px-8 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg text-lg hover:bg-gray-50 transition-colors">
              Find Teammates
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Post Projects</h3>
              <p className="text-gray-600">Have an idea? Create a project, specify the skills you need, and we'll help you find the perfect collaborators.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Opportunities</h3>
              <p className="text-gray-600">Browse projects that match your exact tech stack, interests, and availability. Apply with one click.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600">Our algorithm connects people based on complementary skills, aligned goals, and compatible schedules.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How it works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center max-w-xs">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-primary-200">1</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Create a Profile</h4>
              <p className="text-gray-500">Tell us about your skills, experience, and what you're looking for.</p>
            </div>
            <div className="hidden md:block w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex flex-col items-center max-w-xs">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-primary-200">2</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Get Matched</h4>
              <p className="text-gray-500">Find projects that need your skills or teammates that fit your project.</p>
            </div>
            <div className="hidden md:block w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex flex-col items-center max-w-xs">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-primary-200">3</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Start Building</h4>
              <p className="text-gray-500">Collaborate, learn, and build something awesome together.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Skillz Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
