import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';

const NEED_TYPES = [
    'Cleaning needed',
    'Medical Emergency',
    'Food/Water Needed',
    'Home Essentials Needed',
    'Missing Person',
    'Road/Outdoor Work',
    'Missing or Damaged Items',
    'Other'
];

const DYNAMIC_FIELDS = {
    'Cleaning needed': [
        { name: 'rooms_affected', label: 'Number of rooms affected', type: 'number', required: true },
        { name: 'flood_level', label: 'Flood level height (optional)', type: 'text', required: false },
    ],
    'Medical Emergency': [
        { name: 'medical_issue_type', label: 'Type of medical issue', type: 'text', required: true },
        { name: 'ambulance_needed', label: 'Is immediate ambulance needed?', type: 'select', options: ['yes', 'no'], required: true },
        { name: 'people_injured', label: 'Number of people injured', type: 'number', required: true },
    ],
    'Food/Water Needed': [
        { name: 'adults_count', label: 'Number of adults', type: 'number', required: true },
        { name: 'children_count', label: 'Number of children', type: 'number', required: true },
        { name: 'dietary_restrictions', label: 'Any dietary restrictions?', type: 'text', required: false },
    ],
    'Home Essentials Needed': [
        { name: 'essentials_needed', label: 'What essentials are needed?', type: 'text', required: true },
        { name: 'people_affected', label: 'How many people affected?', type: 'number', required: true },
    ],
    'Missing Person': [
        { name: 'missing_person_name', label: 'Name of missing person', type: 'text', required: true },
        { name: 'age', label: 'Age', type: 'number', required: true },
        { name: 'last_seen_location', label: 'Last seen location', type: 'text', required: true },
        { name: 'medical_conditions', label: 'Any medical conditions?', type: 'text', required: false },
    ],
    'Road/Outdoor Work': [
        { name: 'obstruction_type', label: 'Type of obstruction (tree, debris, etc.)', type: 'text', required: true },
        { name: 'blocking_main_road', label: 'Is it blocking a main road?', type: 'select', options: ['yes', 'no'], required: true },
    ],
    'Missing or Damaged Items': [
        { name: 'items_description', label: 'What items are missing/damaged?', type: 'text', required: true },
        { name: 'estimated_value', label: 'Estimated value (optional)', type: 'text', required: false },
    ],
    'Other': [
        { name: 'issue_description', label: 'Describe the issue', type: 'text', required: true },
    ],
};

export default function HelpRequestCreate() {
    const [coordinates, setCoordinates] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        alternate_phone: '',
        district: '',
        address: '',
        landmark: '',
        coordinates: null,
        type_of_need: '',
        dynamic_fields: {},
        photos: [],
    });

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCoordinates(coords);
                    setData('coordinates', coords);
                },
                (error) => {
                    alert('Error getting location: ' + error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + photos.length > 5) {
            alert('Maximum 5 photos allowed');
            return;
        }

        const newPhotos = [...photos, ...files];
        setPhotos(newPhotos);
        setData('photos', newPhotos);

        // Create previews
        const newPreviews = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                if (newPreviews.length === files.length) {
                    setPhotoPreviews([...photoPreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = photoPreviews.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
        setData('photos', newPhotos);
    };

    const updateDynamicField = (fieldName, value) => {
        setData('dynamic_fields', {
            ...data.dynamic_fields,
            [fieldName]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Prepare data for Inertia
        const submitData = {
            ...data,
            photos: photos,
            dynamic_fields: data.dynamic_fields,
        };

        post(route('help-request.store'), {
            forceFormData: true,
            data: submitData,
        });
    };

    const currentDynamicFields = data.type_of_need ? DYNAMIC_FIELDS[data.type_of_need] || [] : [];

    return (
        <AppLayout>
            <Head title="Submit Help Request" />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Submit Help Request
                        </h2>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="alternate_phone" className="block text-sm font-medium text-gray-700">
                                            Alternate Phone (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            id="alternate_phone"
                                            value={data.alternate_phone}
                                            onChange={(e) => setData('alternate_phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                                            District *
                                        </label>
                                        <input
                                            type="text"
                                            id="district"
                                            value={data.district}
                                            onChange={(e) => setData('district', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                                            Landmark
                                        </label>
                                        <input
                                            type="text"
                                            id="landmark"
                                            value={data.landmark}
                                            onChange={(e) => setData('landmark', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            📍 Get GPS Coordinates
                                        </button>
                                        {coordinates && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Type of Need</h3>
                                <select
                                    id="type_of_need"
                                    value={data.type_of_need}
                                    onChange={(e) => setData('type_of_need', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select type of need</option>
                                    {NEED_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.type_of_need && <p className="mt-1 text-sm text-red-600">{errors.type_of_need}</p>}
                            </div>

                            {currentDynamicFields.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                                    <div className="space-y-4">
                                        {currentDynamicFields.map((field) => (
                                            <div key={field.name}>
                                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                                    {field.label} {field.required && '*'}
                                                </label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        id={field.name}
                                                        value={data.dynamic_fields[field.name] || ''}
                                                        onChange={(e) => updateDynamicField(field.name, e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        required={field.required}
                                                    >
                                                        <option value="">Select...</option>
                                                        {field.options.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        id={field.name}
                                                        value={data.dynamic_fields[field.name] || ''}
                                                        onChange={(e) => updateDynamicField(field.name, e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        required={field.required}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Photos (1-5 images)</h3>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {photoPreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        {photoPreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded" />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.photos && <p className="mt-1 text-sm text-red-600">{errors.photos}</p>}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

