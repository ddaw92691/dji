import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useI18nStore } from "../stores/i18nStore";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const { t } = useI18nStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({
        email,
        phone: "",
        password,
        countryCode: "JP",
        languageCode: "ja",
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message || t("auth.registerFailed", "Registration failed"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">
        {t("auth.createAccount", "Create Account")}
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.email", "Email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("auth.emailPlaceholder", "your@email.com")}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.password", "Password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("auth.passwordMin", "Min 6 characters")}
            required
            minLength={6}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? t("auth.creating", "Creating...")
            : t("auth.register", "Register")}
        </button>
        <p className="text-center text-sm text-gray-500">
          {t("auth.alreadyHaveAccount", "Already have an account?")}{" "}
          <Link to="/login" className="text-blue-600">
            {t("auth.login", "Login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
