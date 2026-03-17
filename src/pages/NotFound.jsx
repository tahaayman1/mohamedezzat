import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="text-[8rem] font-black leading-none text-white/[0.06] select-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-white -mt-6 mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <HiHome size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
