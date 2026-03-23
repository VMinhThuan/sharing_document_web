import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white">
      <h1 className="text-9xl font-bold text-red-500">403</h1>
      <p className="text-2xl mt-4 font-semibold">Access Forbidden</p>
      <p className="mt-2 text-slate-500">
        You do not have permission to access this page.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default Forbidden;
