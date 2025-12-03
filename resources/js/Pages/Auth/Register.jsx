import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Card from '@/Components/Card';
import toast from 'react-hot-toast';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'resident',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                toast.success('Registration successful! Welcome!');
            },
            onError: () => {
                toast.error('Registration failed. Please check your information.');
            },
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-success-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-600">
                            Join us to help coordinate disaster relief efforts
                        </p>
                    </div>
                    
                    <Card>
                        <form className="space-y-4" onSubmit={submit}>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                label="Full Name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                placeholder="Enter your full name"
                            />

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email Address"
                                autoComplete="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                placeholder="Enter your email"
                            />

                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                label="Phone Number"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                error={errors.phone}
                                placeholder="Enter your phone number"
                            />

                            <Select
                                id="role"
                                name="role"
                                label="I am a"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                error={errors.role}
                            >
                                <option value="resident">Resident (Need Help)</option>
                                <option value="volunteer">Volunteer (Want to Help)</option>
                            </Select>

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                autoComplete="new-password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                                placeholder="Create a password"
                            />

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                label="Confirm Password"
                                autoComplete="new-password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={errors.password_confirmation}
                                placeholder="Confirm your password"
                            />

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                                size="lg"
                            >
                                {processing ? 'Creating account...' : 'Register'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
