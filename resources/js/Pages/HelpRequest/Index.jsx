import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';

const NEED_TYPE_COLORS = {
    'Medical Emergency': '#FF0000',
    'Missing Person': '#FF0000',
    'Food/Water Needed': '#FFA500',
    'Road/Outdoor Work': '#FFA500',
    'Cleaning Needed': '#FFFF00',
    'Home Essentials Needed': '#FFFF00',
    'Missing or Damaged Items': '#FFFF00',
    'Other': '#808080',
    'Resolved': '#00FF00',
};

const containerStyle = {
    width: '100%',
    height: '100vh'
};

export default function HelpRequestIndex({ requests }) {
    const { auth } = usePage().props;
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filters, setFilters] = useState({
        district: '',
        status: '',
        type_of_need: '',
    });

    const center = useMemo(() => ({
        lat: 7.8731, // Sri Lanka center
        lng: 80.7718
    }), []);

    const filteredRequests = useMemo(() => {
        return requests.data.filter(request => {
            if (filters.district && request.district !== filters.district) return false;
            if (filters.status && request.status !== filters.status) return false;
            if (filters.type_of_need && request.type_of_need !== filters.type_of_need) return false;
            return true;
        });
    }, [requests.data, filters]);

    const districts = useMemo(() => {
        return [...new Set(requests.data.map(r => r.district).filter(Boolean))];
    }, [requests.data]);

    const needTypes = useMemo(() => {
        return [...new Set(requests.data.map(r => r.type_of_need).filter(Boolean))];
    }, [requests.data]);

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getMarkerColor = (request) => {
        if (request.status === 'resolved') return NEED_TYPE_COLORS['Resolved'];
        return NEED_TYPE_COLORS[request.type_of_need] || '#808080';
    };

    return (
        <AppLayout>
            <Head title="Help Requests Map" />
            <div className="flex" style={{ height: 'calc(100vh - 200px)' }}>
                {/* Modern Filter Sidebar */}
                <div className="w-80 bg-white shadow-soft border-r border-gray-200 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Filters</h2>
                    
                    <div className="space-y-6">
                        <Select
                            label="District"
                            value={filters.district}
                            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                        >
                            <option value="">All Districts</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </Select>

                        <Select
                            label="Status"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            <option value="submitted">Submitted</option>
                            <option value="unverified">Unverified</option>
                            <option value="verified">Verified</option>
                            <option value="volunteer_assigned">Assigned</option>
                            <option value="resolved">Resolved</option>
                        </Select>

                        <Select
                            label="Need Type"
                            value={filters.type_of_need}
                            onChange={(e) => setFilters({ ...filters, type_of_need: e.target.value })}
                        >
                            <option value="">All Types</option>
                            {needTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>
                    </div>

                    {/* Modern Legend */}
                    <Card className="mt-8">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Legend</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-red-500 rounded-full mr-3 shadow-soft"></div>
                                <span className="text-gray-700">Medical/Missing Person</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-orange-500 rounded-full mr-3 shadow-soft"></div>
                                <span className="text-gray-700">Food/Water/Road Work</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-yellow-500 rounded-full mr-3 shadow-soft"></div>
                                <span className="text-gray-700">Cleaning/Essentials</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-green-500 rounded-full mr-3 shadow-soft"></div>
                                <span className="text-gray-700">Resolved</span>
                            </div>
                        </div>
                    </Card>

                    <div className="mt-6 text-sm text-gray-600">
                        <p>Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.data.length}</strong> requests</p>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative">
                    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={8}
                            options={{
                                styles: [
                                    {
                                        featureType: 'poi',
                                        elementType: 'labels',
                                        stylers: [{ visibility: 'off' }]
                                    }
                                ]
                            }}
                        >
                            {filteredRequests
                                .filter(request => request.coordinates && request.coordinates.lat && request.coordinates.lng)
                                .map((request) => (
                                    <Marker
                                        key={request.id}
                                        position={{
                                            lat: parseFloat(request.coordinates.lat),
                                            lng: parseFloat(request.coordinates.lng)
                                        }}
                                        icon={{
                                            path: window.google?.maps?.SymbolPath?.CIRCLE,
                                            scale: 10,
                                            fillColor: getMarkerColor(request),
                                            fillOpacity: 0.9,
                                            strokeColor: '#FFFFFF',
                                            strokeWeight: 2,
                                        }}
                                        onClick={() => setSelectedRequest(request)}
                                    />
                                ))}
                            
                            {selectedRequest && selectedRequest.coordinates && (
                                <InfoWindow
                                    position={{
                                        lat: parseFloat(selectedRequest.coordinates.lat),
                                        lng: parseFloat(selectedRequest.coordinates.lng)
                                    }}
                                    onCloseClick={() => setSelectedRequest(null)}
                                >
                                    <div className="p-3 max-w-xs">
                                        <h3 className="font-bold text-lg mb-2 text-gray-900">{selectedRequest.name}</h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                                            <p><strong>Need:</strong> {selectedRequest.type_of_need}</p>
                                            <p><strong>Status:</strong> <span className="capitalize">{selectedRequest.status.replace('_', ' ')}</span></p>
                                            <p><strong>District:</strong> {selectedRequest.district}</p>
                                            {selectedRequest.address && (
                                                <p><strong>Address:</strong> {selectedRequest.address}</p>
                                            )}
                                            {auth?.user && auth.user.coordinates && selectedRequest.coordinates && (
                                                <p className="mt-2 text-primary-600">
                                                    <strong>Distance:</strong> {calculateDistance(
                                                        auth.user.coordinates.lat,
                                                        auth.user.coordinates.lng,
                                                        parseFloat(selectedRequest.coordinates.lat),
                                                        parseFloat(selectedRequest.coordinates.lng)
                                                    ).toFixed(2)} km
                                                </p>
                                            )}
                                        </div>
                                        {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium mb-2">Photos:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {selectedRequest.photos.map((photo, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={`/storage/${photo.photo_path}`}
                                                            alt={`Photo ${idx + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg shadow-soft"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
        </AppLayout>
    );
}
