// features/auth/components/SignupForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { SignupFormData, SignupValidationErrors } from "../types";
import { loadDaumPostcode } from "../utils/formUtils";
import { authApi } from "../api/authApi";
import AddressInput from "./AddressInput";
import PaymentMethodInput from "./PaymentMethodInput";

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    name: "",
    contact: "",
    address: {
      postalCode: "",
      roadAddress: "",
      detailAddress: "",
    },
    paymentMethod: {
      paymentType: "CREDIT_CARD",
      cardNumber: "",
      expiryDate: "",
      isDefault: true,
    },
  });

  const [errors, setErrors] = useState<SignupValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 주소 검색 스크립트 로드
  useEffect(() => {
    loadDaumPostcode().catch((error) => {
      console.error("우편번호 서비스 로드 오류:", error);
    });
  }, []);

  // 입력값 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: SignupValidationErrors = {};

    // 사용자명 검증
    if (formData.username.length < 4) {
      newErrors.username = "사용자명은 4자 이상이어야 합니다";
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    // 이름 검증
    if (formData.name.trim() === "") {
      newErrors.name = "이름을 입력해주세요";
    }

    // 연락처 검증
    if (!/^\d{10,11}$/.test(formData.contact.replace(/-/g, ""))) {
      newErrors.contact = "올바른 연락처 형식이 아닙니다";
    }

    // 카드 정보 검증
    if (
      !/^\d{16}$/.test(formData.paymentMethod.cardNumber.replace(/\s/g, ""))
    ) {
      newErrors.paymentMethod = {
        ...newErrors.paymentMethod,
        cardNumber: "올바른 카드번호 형식이 아닙니다",
      };
    }

    if (
      !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.paymentMethod.expiryDate)
    ) {
      newErrors.paymentMethod = {
        ...newErrors.paymentMethod,
        expiryDate: "올바른 만료일 형식이 아닙니다 (MM/YY)",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 에러 메시지 초기화
    if (errors[name as keyof SignupValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddressChange = (address: typeof formData.address) => {
    setFormData((prev) => ({ ...prev, address }));
  };

  const handlePaymentMethodChange = (
    paymentMethod: typeof formData.paymentMethod
  ) => {
    setFormData((prev) => ({ ...prev, paymentMethod }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authApi.signup(formData);

      navigate("/login", {
        state: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
      });
    } catch (err: any) {
      setError(err?.message || "회원가입에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? "border-red-500" : ""
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.name ? "border-red-500" : ""
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contact"
          >
            Contact
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.contact ? "border-red-500" : ""
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

        {/* Address - 분리된 컴포넌트 사용 */}
        <AddressInput
          address={formData.address}
          onChange={handleAddressChange}
          errors={errors.address}
        />

        {/* Payment Method - 분리된 컴포넌트 사용 */}
        <PaymentMethodInput
          paymentMethod={formData.paymentMethod}
          onChange={handlePaymentMethodChange}
          errors={errors.paymentMethod}
        />

        {/* Submit Button and Login Link */}
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                Signing up...
              </div>
            ) : (
              "Sign Up"
            )}
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