export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Company</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Policy</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          © 2024 Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
