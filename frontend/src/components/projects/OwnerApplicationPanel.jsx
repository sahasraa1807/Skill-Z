import Avatar from '../common/Avatar';
import Button from '../common/Button';

export default function OwnerApplicationPanel({ applications, onAccept, onReject, isProcessing }) {
  if (!applications) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Applications ({applications.length})</h3>
      
      {applications.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          No applications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id || app.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Avatar user={app.user} size="md" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {app.user?.firstName} {app.user?.lastName}
                    </h4>
                    <p className="text-xs text-gray-500">@{app.user?.username}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {app.message && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                  "{app.message}"
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => onReject(app._id || app.id)}
                  disabled={isProcessing}
                >
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => onAccept(app._id || app.id)}
                  disabled={isProcessing}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
