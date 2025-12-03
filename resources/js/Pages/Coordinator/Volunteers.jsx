import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CoordinatorVolunteers({ volunteers }) {
    const approveVolunteer = (id) => {
        router.post(route('coordinator.volunteers.approve', id));
    };

    const rejectVolunteer = (id) => {
        router.post(route('coordinator.volunteers.reject', id));
    };

    return (
        <AppLayout>
            <Head title="Manage Volunteers" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Manage Volunteers</h1>
                            <Link
                                href={route('coordinator.dashboard')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {volunteers.data.map((volunteer) => (
                                    <li key={volunteer.id}>
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {volunteer.name}
                                                        </p>
                                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            volunteer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {volunteer.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        <p>Email: {volunteer.email}</p>
                                                        <p>Phone: {volunteer.phone}</p>
                                                        <p>District: {volunteer.district}</p>
                                                        <p>City: {volunteer.city}</p>
                                                        <p>Skills: {volunteer.skills?.join(', ')}</p>
                                                        <p>Availability: {volunteer.availability}</p>
                                                        <p>Assignments: {volunteer.assignments_count}</p>
                                                    </div>
                                                </div>
                                                {volunteer.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => approveVolunteer(volunteer.id)}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => rejectVolunteer(volunteer.id)}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
            </div>
        </AppLayout>
    );
}

