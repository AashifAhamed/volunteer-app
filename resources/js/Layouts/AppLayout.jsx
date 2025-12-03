import { Link, usePage, router } from '@inertiajs/react';
import Button from '@/Components/Button';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern Header */}
            <header className="bg-white shadow-soft border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-gray-900">Disaster Relief</span>
                            </Link>
                        </div>
                        <nav className="flex items-center space-x-4">
                            {auth?.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    {auth.user.isCoordinator && (
                                        <Link
                                            href={route('coordinator.dashboard')}
                                            className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                                        >
                                            Coordinator
                                        </Link>
                                    )}
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="outline" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="sm">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="min-h-screen">{children}</main>

            {/* Modern Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">About</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Connecting affected residents, volunteers, and coordinators for disaster relief operations in Sri Lanka.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Privacy</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Your privacy is important to us. We protect your personal information and ensure secure data handling.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                For support and inquiries, please contact your local coordinator or emergency services.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Credits</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Built for Sri Lanka Disaster Relief Coordination. Supporting communities in times of need.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            &copy; {new Date().getFullYear()} Disaster Relief Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
