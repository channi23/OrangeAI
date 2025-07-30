import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-orange-500 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">OrangeAI</h1>
        <ul className="flex space-x-6 text-lg">
          <li>
            <Link
              to="/"
              className="hover:text-orange-200 transition-all duration-300 ease-in-out"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="hover:text-orange-200 transition-all duration-300 ease-in-out"
            >
              Upload
            </Link>
          </li>
          <li>
            <Link
              to="/results"
              className="hover:text-orange-200 transition-all duration-300 ease-in-out"
            >
              Results
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;