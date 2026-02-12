"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ERROR_MESSAGES } from "@/utils/constants";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username.trim()) {
      setError("Veuillez entrer votre nom d'utilisateur.");
      return;
    }

    if (!password.trim()) {
      setError("Veuillez entrer votre mot de passe.");
      return;
    }

    setIsSubmitting(true);

    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username.trim(), password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="mb-1">EPI-RDC</h1>
        <p className="text-text-secondary text-[15px]">
          Rapport Épidémiologique Hebdomadaire
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      {/* Username */}
      <Input
        label="Nom d'utilisateur"
        type="text"
        placeholder="Entrez votre nom d'utilisateur"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError("");
        }}
        autoComplete="username"
        autoFocus
      />

      {/* Password */}
      <Input
        label="Mot de passe"
        type="password"
        placeholder="Entrez votre mot de passe"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        autoComplete="current-password"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
      >
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}