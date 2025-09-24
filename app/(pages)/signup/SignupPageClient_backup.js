'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Crown, Percent, Gift, Zap, Check, X } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignupPageClient = ({ signupData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupStatus, setSignupStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Icon mapping function
  const getIcon = (iconName) => {
    const icons = {
      Crown,
      Percent,
      Gift,
      Zap
    };
    return icons[iconName] || Crown;
  };

  // Password strength validation
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!Object.values(passwordCheck).every(Boolean)) {
        newErrors.password = 'Password does not meet requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must agree to the Terms & Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;


    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    


    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };








  

  // Handle manual signup
const handleSignup = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setSignupStatus(null);
  setErrors({});

  try {
    const userData = {
      name: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      password: formData.password,
      image: null, // No image for manual signup
      subscribeNewsletter: formData.subscribeNewsletter
    };

    await addData(userData, {
      onSuccess: () => {
        // ✅ Only redirect on actual success
        setSignupStatus("success");
        setTimeout(() => {
          router.push("/login?message=Account created successfully");
        }, 2000);
      },
      onError: (error) => {
        // ✅ Show error message instead of redirect
        setSignupStatus("error");

        if (error.message.includes("already registered")) {
          setSignupStatus("info");
          setErrors(prev => ({
            ...prev,
            api: "This email is already registered. Please log in instead."
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            api: error.message || "Failed to create account. Please try again."
          }));
        }
      }
    });
  } catch (error) {
    console.error("Unexpected signup error:", error);
    setSignupStatus("error");
    setErrors(prev => ({
      ...prev,
      api: "Something went wrong. Please try again."
    }));
  }
};














  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 }
    }
  };

  // Password requirements component
  const PasswordRequirements = () => {
    const requirements = validatePassword(formData.password);
    
    return (
      <div className="mt-2 space-y-1">
        {signupData.passwordRequirements.map((requirement, index) => {
          const isValid = Object.values(requirements)[index];
          return (
            <div key={index} className="flex items-center text-xs">
              {isValid ? (
                <Check className="w-3 h-3 text-green-500 mr-2" />
              ) : (
                <X className="w-3 h-3 text-gray-400 mr-2" />
              )}
              <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                {requirement}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          className="max-w-md w-full space-y-8"
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          {/* Brand Header */}
          <div className="text-center">
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-2"
              variants={itemVariants}
            >
              {signupData.brandInfo.name}
            </motion.h1>
            <motion.p
              className="text-sm text-gray-600 mb-8"
              variants={itemVariants}
            >
              {signupData.brandInfo.tagline}
            </motion.p>
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-2"
              variants={itemVariants}
            >
              {signupData.formData.title}
            </motion.h2>
            <motion.p
              className="text-gray-600"
              variants={itemVariants}
            >
              {signupData.formData.subtitle}
            </motion.p>
          </div>

          {/* Google Signup Button */}
          {signupData.authConfig.enableGoogleSignup && (
            <GoogleSignButton />
          )}

          {/* Divider */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </motion.div>

          {/* Signup Form */}
          <motion.form
            onSubmit={handleSignup}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={signupData.formData.firstNamePlaceholder}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={signupData.formData.lastNamePlaceholder}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={signupData.formData.emailPlaceholder}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={signupData.formData.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formData.password && <PasswordRequirements />}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={signupData.formData.confirmPasswordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </motion.div>

            {/* Terms & Newsletter */}
            <motion.div
              className="space-y-4"
              variants={itemVariants}
            >
              {/* Terms Acceptance */}
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mt-1"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  {signupData.formData.termsText.split(' and ')[0]}{' '}
                  <Link href={signupData.formData.termsLink} className="text-black hover:text-gray-700 font-medium">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href={signupData.formData.privacyLink} className="text-black hover:text-gray-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}

              {/* Newsletter Subscription */}
              {signupData.authConfig.enableNewsletterOptIn && (
                <div className="flex items-start">
                  <input
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={handleChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-700">
                    {signupData.formData.newsletterText}
                  </label>
                </div>
              )}
            </motion.div>

          {/* Signup Status */}
{signupStatus && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-lg text-center ${
      signupStatus === 'success'
        ? 'bg-green-100 text-green-700 border border-green-200'
        : signupStatus === 'info'
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : 'bg-red-100 text-red-700 border border-red-200'
    }`}
  >
    {signupStatus === 'success' && 'Account created successfully! Redirecting to login...'}
    {signupStatus === 'info' && 'This email is already registered. Please log in instead.'}
    {signupStatus === 'error' && 'Failed to create account. Please try again.'}
  </motion.div>
)}


            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              variants={itemVariants}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                signupData.formData.signupButtonText
              )}
            </motion.button>
          </motion.form>

          {/* Login Link */}
          {signupData.authConfig.showLoginLink && (
            <motion.div
              className="text-center"
              variants={itemVariants}
            >
              <p className="text-sm text-gray-600">
                {signupData.formData.hasAccountText}{' '}
                <Link
                  href={signupData.formData.loginLink}
                  className="font-medium text-black hover:text-gray-700"
                >
                  {signupData.formData.loginText}
                </Link>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Benefits & Background */}
      <div className="hidden lg:flex flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={signupData.backgroundImage}
            alt="Fashion Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Benefits Content */}
        <motion.div
          className="relative z-10 flex items-center justify-center p-12"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-md text-white">
            <motion.h3
              className="text-3xl font-bold mb-6"
              variants={itemVariants}
            >
              {signupData.brandInfo.description}
            </motion.h3>
            
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {signupData.benefits.map((benefit, index) => {
                const IconComponent = getIcon(benefit.iconName);
                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    variants={itemVariants}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPageClient;