import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const SKILLS = [
    'Cleaning',
    'Medical Support',
    'Food/Water Distribution',
    'Home Essentials',
    'Outdoor/Road Work',
    'Search & Missing Person Support',
    'Other'
];

const AVAILABILITY_OPTIONS = [
    'Immediate',
    'Within 24 hours',
    'This week'
];

export default function VolunteerRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        phone_whatsapp: '',
        city: '',
        district: '',
        nic: '',
        skills: [],
        availability: '',
        password: '',
        password_confirmation: '',
    });

    const [selectedSkills, setSelectedSkills] = useState([]);

    const toggleSkill = (skill) => {
        const newSkills = selectedSkills.includes(skill)
            ? selectedSkills.filter(s => s !== skill)
            : [...selectedSkills, skill];
        setSelectedSkills(newSkills);
        setData('skills', newSkills);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('volunteer.register.store'));
    };

    return (
        <>
            <Head title="Volunteer Registration" />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Volunteer Registration
                        </h2>
                        <form onSubmit={submit} className="space-y-6">
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                                <label htmlFor="phone_whatsapp" className="block text-sm font-medium text-gray-700">
                                    WhatsApp Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone_whatsapp"
                                    value={data.phone_whatsapp}
                                    onChange={(e) => setData('phone_whatsapp', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.phone_whatsapp && <p className="mt-1 text-sm text-red-600">{errors.phone_whatsapp}</p>}
                            </div>

                            <div>
                                <label htmlFor="nic" className="block text-sm font-medium text-gray-700">
                                    NIC Number *
                                </label>
                                <input
                                    type="text"
                                    id="nic"
                                    value={data.nic}
                                    onChange={(e) => setData('nic', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
                            </div>

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
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills * (Select all that apply)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SKILLS.map((skill) => (
                                        <label key={skill} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedSkills.includes(skill)}
                                                onChange={() => toggleSkill(skill)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
                            </div>

                            <div>
                                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                                    Availability *
                                </label>
                                <select
                                    id="availability"
                                    value={data.availability}
                                    onChange={(e) => setData('availability', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select availability</option>
                                    {AVAILABILITY_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

