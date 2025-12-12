'use client';

export default function Footer({ variant = "default" }) {
  const currentYear = new Date().getFullYear();

  if (variant === "simple") {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">&copy; {currentYear} ParkCompare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative text-white mt-10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 opacity-95" aria-hidden />
      <div className="absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-white/10 to-transparent blur-3xl" aria-hidden />
      <div className="relative container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">CompareMy</span>
              <span className="text-2xl font-black text-orange-300">Parkings</span>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Ultra-fast, secure and beautifully crafted airport parking journeys tailored to every traveller.
            </p>
            <div className="badge-grid max-w-md">
              <span className="badge-tile bg-white/10 border-white/20 text-white">24/7 Support</span>
              <span className="badge-tile bg-white/10 border-white/20 text-white">Price Promise</span>
              <span className="badge-tile bg-white/10 border-white/20 text-white">Trusted Partners</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Heathrow Parking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gatwick Parking (coming soon)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Stansted Parking (coming soon)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Luton Parking (coming soon)</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="/terms-conditions" className="hover:text-white transition-colors">Terms and conditions</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="section-shell bg-white/5 border-white/20">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <address className="not-italic space-y-2 text-blue-100">
              <p>Email: info@comparemyparkings.co.uk</p>
              <p>Phone: +44 7876 239148</p>
              <p className="pt-2">Open 7 days a week</p>
              <p>8am - 8pm</p>
            </address>
            <button className="cta-button w-full justify-center mt-4" onClick={() => window.location.href = '/help'}>
              Talk to support
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} CompareMyParkings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}