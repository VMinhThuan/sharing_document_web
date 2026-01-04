import { Link } from 'react-router-dom';

const DocumentCard = ({ document }) => {
  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return '📕';
    if (type?.includes('word') || type?.includes('doc')) return '📘';
    if (type?.includes('excel') || type?.includes('xls')) return '📗';
    if (type?.includes('powerpoint') || type?.includes('ppt')) return '📙';
    return '📄';
  };

  return (
    <Link to={`/documents/${document.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="text-3xl md:text-4xl flex-shrink-0">{getFileIcon(document.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate mb-1">
              {document.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mb-2 line-clamp-2">
              {document.description || 'No description available'}
            </p>
            <div className="flex items-center gap-2 md:gap-4 text-xs text-gray-400 flex-wrap">
              <span>{document.size || 'N/A'}</span>
              <span>•</span>
              <span>{document.uploadedAt}</span>
            </div>
          </div>
        </div>
        {document.aiSummary && (
          <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-1">
              <span className="font-medium">AI Summary:</span> {document.aiSummary}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default DocumentCard;

