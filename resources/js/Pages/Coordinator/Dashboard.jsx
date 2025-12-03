import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import toast from 'react-hot-toast';

export default function CoordinatorDashboard({ requests, stats }) {
    const verifyRequest = (id) => {
        router.post(route('coordinator.requests.verify', id), {
            onSuccess: () => toast.success('Request verified successfully'),
            onError: () => toast.error('Failed to verify request'),
        });
    };

    const updateStatus = (id, status) => {
        router.post(route('coordinator.requests.status', id), { 
            status 
        }, {
            onSuccess: () => toast.success('Status updated successfully'),
            onError: () => toast.error('Failed to update status'),
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'submitted': 'bg-gray-100 text-gray-800',
            'unverified': 'bg-warning-100 text-warning-800',
            'verified': 'bg-primary-100 text-primary-800',
            'volunteer_assigned': 'bg-purple-100 text-purple-800',
            'resolved': 'bg-success-100 text-success-800',
        };
        return colors[status] || colors['submitted'];
    };

    return (
        <AppLayout>
            <Head title="Coordinator Dashboard" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Coordinator Dashboard</h1>
                        <p className="text-gray-600">Manage requests, volunteers, and coordinate relief efforts</p>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total_requests}</div>
                                <div className="text-sm font-medium text-gray-600">Total Requests</div>
                            </div>
                        </Card>
                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-warning-600 mb-1">{stats.unverified_requests}</div>
                                <div className="text-sm font-medium text-gray-600">Unverified</div>
                            </div>
                        </Card>
                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary-600 mb-1">{stats.verified_requests}</div>
                                <div className="text-sm font-medium text-gray-600">Verified</div>
                            </div>
                        </Card>
                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.assigned_requests}</div>
                                <div className="text-sm font-medium text-gray-600">Assigned</div>
                            </div>
                        </Card>
                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-success-600 mb-1">{stats.resolved_requests}</div>
                                <div className="text-sm font-medium text-gray-600">Resolved</div>
                            </div>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <Link href={route('coordinator.volunteers')}>
                            <Button variant="primary">
                                Manage Volunteers {stats.pending_volunteers > 0 && `(${stats.pending_volunteers} pending)`}
                            </Button>
                        </Link>
                        <Link href={route('help-request.index')}>
                            <Button variant="success">
                                View Map
                            </Button>
                        </Link>
                    </div>

                    {/* Requests Table */}
                    <Card>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Requests</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Need Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.data.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                                <div className="text-sm text-gray-500">{request.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.type_of_need}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.district}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                    {request.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {request.status === 'unverified' && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => verifyRequest(request.id)}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => updateStatus(request.id, e.target.value)}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                                                >
                                                    <option value="submitted">Submitted</option>
                                                    <option value="unverified">Unverified</option>
                                                    <option value="verified">Verified</option>
                                                    <option value="volunteer_assigned">Assigned</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
            </div>
        </AppLayout>
    );
}
