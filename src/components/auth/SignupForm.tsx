import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

interface AddressForm {
  address: string;
  city: string;
  postalCode: string;
}

interface PaymentMethodForm {
  paymentType: string;
  cardNumber: string;
  expiryDate: string;
  isDefault: boolean;
}

interface SignupFormData {
  username: string;
  password: string;
  name: string;
  contact: string;
  address: AddressForm;
  paymentMethod: PaymentMethodForm;
}

interface ValidationErrors {
  username?: string;
  password?: string;
  name?: string;
  contact?: string;
  address?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
  paymentMethod?: {
    cardNumber?: string;
    expiryDate?: string;
  };
}

const SignupForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    name: '',
    contact: '',
    address: {
      address: '',
      city: '',
      postalCode: ''
    },
    paymentMethod: {
      paymentType: 'CREDIT_CARD',
      cardNumber: '',
      expiryDate: '',
      isDefault: true
    }
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 입력값 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // 사용자명 검증
    if (formData.username.length < 4) {
      newErrors.username = '사용자명은 4자 이상이어야 합니다';
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    // 이름 검증
    if (formData.name.trim() === '') {
      newErrors.name = '이름을 입력해주세요';
    }

    // 연락처 검증
    if (!/^\d{10,11}$/.test(formData.contact.replace(/-/g, ''))) {
      newErrors.contact = '올바른 연락처 형식이 아닙니다';
    }

    // 주소 검증
    if (!formData.address.address.trim()) {
      newErrors.address = { ...newErrors.address, address: '주소를 입력해주세요' };
    }
    if (!formData.address.city.trim()) {
      newErrors.address = { ...newErrors.address, city: '도시를 입력해주세요' };
    }
    if (!/^\d{5}$/.test(formData.address.postalCode)) {
      newErrors.address = { ...newErrors.address, postalCode: '올바른 우편번호 형식이 아닙니다' };
    }

    // 카드 정보 검증
    if (!/^\d{16}$/.test(formData.paymentMethod.cardNumber.replace(/\s/g, ''))) {
      newErrors.paymentMethod = { ...newErrors.paymentMethod, cardNumber: '올바른 카드번호 형식이 아닙니다' };
    }
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.paymentMethod.expiryDate)) {
      newErrors.paymentMethod = { ...newErrors.paymentMethod, expiryDate: '올바른 만료일 형식이 아닙니다 (MM/YY)' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'paymentMethod.cardNumber') {
      const formatted = formatCardNumber(value);
      setFormData(prev => ({
        ...prev,
        paymentMethod: { ...prev.paymentMethod, cardNumber: formatted }
      }));
      return;
    }

    if (name === 'paymentMethod.expiryDate') {
      const formatted = formatExpiryDate(value);
      setFormData(prev => ({
        ...prev,
        paymentMethod: { ...prev.paymentMethod, expiryDate: formatted }
      }));
      return;
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: parent === 'address'
          ? { ...prev.address, [child]: value }
          : { ...prev.paymentMethod, [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // 에러 메시지 초기화
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (errors[parent as keyof ValidationErrors]) {
        setErrors(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof ValidationErrors] as object),
            [child]: undefined
          }
        }));
      }
    } else if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다');
      }

      navigate('/login', { 
        state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? 'border-red-500' : ''
            }`}
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? 'border-red-500' : ''
              }`}
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.name ? 'border-red-500' : ''
            }`}
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
            Contact
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.contact ? 'border-red-500' : ''
            }`}
            id="contact"
            type="tel"
            name="contact"
            placeholder="01012345678"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          {errors.contact && (
            <p className="text-red-500 text-xs italic">{errors.contact}</p>
          )}
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <h3 className="block text-gray-700 font-bold mb-2">Address</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Street Address
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.address?.address ? 'border-red-500' : ''
                }`}
                id="address"
                type="text"
                name="address.address"
                value={formData.address.address}
                onChange={handleChange}
                required
              />
              {errors.address?.address && (
                <p className="text-red-500 text-xs italic">{errors.address.address}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.address?.city ? 'border-red-500' : ''
                }`}
                id="city"
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
              />
              {errors.address?.city && (
                <p className="text-red-500 text-xs italic">{errors.address.city}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.address?.postalCode ? 'border-red-500' : ''
                }`}
                id="postalCode"
                type="text"
                name="address.postalCode"
                placeholder="12345"
                value={formData.address.postalCode}
                onChange={handleChange}
                required
              />
              {errors.address?.postalCode && (
                <p className="text-red-500 text-xs italic">{errors.address.postalCode}</p>
              )}
            </div>
          </div>
        </div>
        {/* Payment Method Section */}
        <div className="mb-6">
          <h3 className="block text-gray-700 font-bold mb-2">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                Card Number
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.paymentMethod?.cardNumber ? 'border-red-500' : ''
                }`}
                id="cardNumber"
                type="text"
                name="paymentMethod.cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.paymentMethod.cardNumber}
                onChange={handleChange}
                required
                maxLength={19}
              />
              {errors.paymentMethod?.cardNumber && (
                <p className="text-red-500 text-xs italic">{errors.paymentMethod.cardNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
                Expiry Date
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.paymentMethod?.expiryDate ? 'border-red-500' : ''
                }`}
                id="expiryDate"
                type="text"
                name="paymentMethod.expiryDate"
                placeholder="MM/YY"
                value={formData.paymentMethod.expiryDate}
                onChange={handleChange}
                required
                maxLength={5}
              />
              {errors.paymentMethod?.expiryDate && (
                <p className="text-red-500 text-xs italic">{errors.paymentMethod.expiryDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button and Login Link */}
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                Signing up...
              </div>
            ) : 'Sign Up'}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
 );
};

export default SignupForm;