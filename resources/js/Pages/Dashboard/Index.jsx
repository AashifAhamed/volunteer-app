import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function Dashboard({ user }) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-gray-600">
                            Manage your requests and help coordinate relief efforts
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.role === 'resident' && (
                            <>
                                <Link href={route('help-request.create')}>
                                    <Card hover className="h-full">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                Submit Help Request
                                            </h2>
                                            <p className="text-gray-600 mb-4">
                                                Need assistance? Submit a help request with your location and needs.
                                            </p>
                                            <Button className="w-full">Submit Request</Button>
                                        </div>
                                    </Card>
                                </Link>
                                <Link href={route('help-request.index')}>
                                    <Card hover className="h-full">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                View Requests Map
                                            </h2>
                                            <p className="text-gray-600 mb-4">
                                                See all help requests on an interactive map.
                                            </p>
                                            <Button variant="outline" className="w-full">View Map</Button>
                                        </div>
                                    </Card>
                                </Link>
                            </>
                        )}
                        
                        {user.role === 'volunteer' && (
                            <Link href={route('help-request.index')}>
                                <Card hover className="h-full">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            View Help Requests
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                            See available help requests and find ways to help.
                                        </p>
                                        <Button className="w-full">View Requests</Button>
                                    </div>
                                </Card>
                            </Link>
                        )}
                    </div>
            </div>
        </AppLayout>
    );
}
