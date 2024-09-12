import { useState } from 'react'
import { Layout } from '~/components/layout'
import { FormField } from '~/components/form-field'

export default function Login() {
    const [action, setAction] = useState('login')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    })

    // Updates the form data when an input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <Layout>
            <div className="h-full justify-center items-center flex flex-col gap-y-4">
                <h2 className="text-5xl font-extrabold text-yellow-300">Welcome to Kudos!</h2>
                <p className="font-semibold text-slate-300">
                    {action === 'login' ? 'Log In To Give Some Praise!' : 'Sign Up To Get Started!'}
                </p>

                <form method="POST" className="rounded-2xl bg-gray-200 p-6 w-96">
                    {/* Email Field */}
                    <FormField
                        htmlFor="email"
                        label="Email"
                        value={formData.email}
                        onChange={e => handleInputChange(e, 'email')}
                    />
                    {/* Password Field */}
                    <FormField
                        htmlFor="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={e => handleInputChange(e, 'password')}
                    />

                    {/* Only show these fields if action is "register" */}
                    {action === 'register' && (
                        <>
                            {/* First Name Field */}
                            <FormField
                                htmlFor="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={e => handleInputChange(e, 'firstName')}
                            />
                            {/* Last Name Field */}
                            <FormField
                                htmlFor="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={e => handleInputChange(e, 'lastName')}
                            />
                        </>
                    )}

                    {/* Submit Button */}
                    <div className="w-full text-center">
                        <input
                            type="submit"
                            className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                            value={action === 'login' ? 'Sign In' : 'Register'}
                        />
                    </div>
                </form>
            </div>

            <div className="h-full justify-center items-center flex flex-col gap-y-4">
                {/* Button to switch between login and register */}
                <button
                    onClick={() => setAction(action === 'login' ? 'register' : 'login')}
                    className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                >
                    {action === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
            </div>
        </Layout>
    )
}
