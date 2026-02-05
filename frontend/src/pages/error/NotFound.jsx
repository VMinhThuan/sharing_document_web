import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <p className="text-2xl mt-4 font-semibold">Page Not Found</p>
      <p className="mt-2 text-slate-500">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
