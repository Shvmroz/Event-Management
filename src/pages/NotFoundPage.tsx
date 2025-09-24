import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="max-w-sm w-full text-center">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Page Not Found
        </h2>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved.
       
        </p>

    
      </div>
    </div>
  );
}
