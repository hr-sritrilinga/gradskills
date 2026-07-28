"use client"

import * as React from "react"
import { useState } from "react";
import { LogIn, Mail, ArrowLeft, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignIn2 = () => {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // States: 'enter-email', 'enter-otp', 'access-denied'
  const [mode, setMode] = useState<'enter-email' | 'enter-otp' | 'access-denied'>('enter-email');

  const ALLOWED_EMAIL = "kakkirenivishwas@gmail.com";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded || !isSignUpLoaded) return;

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    // Strict Whitelist Check
    if (cleanEmail !== ALLOWED_EMAIL) {
      setMode('access-denied');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Try to Sign In
      try {
        const { supportedFirstFactors } = await signIn.create({
          identifier: cleanEmail,
        });

        const isEmailCodeSupported = supportedFirstFactors?.find(
          (f: any) => f.strategy === "email_code"
        );

        if (isEmailCodeSupported) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: isEmailCodeSupported.emailAddressId,
          });
          setMode('enter-otp');
          setLoading(false);
          return;
        }
      } catch (signInErr: any) {
        // If user not found, try to Sign Up instead
        if (signInErr.errors?.[0]?.code === "form_identifier_not_found") {
          await signUp.create({
            emailAddress: cleanEmail,
          });
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setMode('enter-otp');
          setLoading(false);
          return;
        } else {
          throw signInErr;
        }
      }

      setError("Email verification (OTP) is not enabled for this project. Please enable it in the Clerk Dashboard.");
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded || !isSignUpLoaded) return;

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Check if Sign In is already complete
      if (signIn.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        navigate("/buildathon-admin");
        return;
      }

      // 2. Check if Sign Up is already complete
      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        navigate("/buildathon-admin");
        return;
      }

      // 3. Handle active flows
      if (signIn.status === "needs_first_factor" || signIn.status === "needs_second_factor") {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          navigate("/buildathon-admin");
        } else {
          setError(`Verification incomplete: ${result.status}`);
        }
      } else if (signUp.status === "missing_requirements") {
        const result = await signUp.attemptEmailAddressVerification({
          code,
        });
        
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          navigate("/buildathon-admin");
        } else if (result.status === "missing_requirements") {
          // If still missing requirements (likely password), provide a random one to finish
          const randomPassword = Math.random().toString(36).slice(-12) + "A1!";
          const finalResult = await signUp.update({
            password: randomPassword,
          });
          
          if (finalResult.status === "complete") {
            await setActive({ session: finalResult.createdSessionId });
            navigate("/buildathon-admin");
          } else {
            setError(`Missing fields: ${finalResult.missingFields.join(", ")}`);
          }
        } else {
          setError(`Verification incomplete: ${result.status}`);
        }
      } else {
        // Fallback for strange states like "already verified"
        setError("Your session state is out of sync. Please refresh the page and try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-[1]">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-blue-100 text-black">

        {/* Header Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-blue-900/5 relative">
          {mode === 'enter-otp' && (
            <button
              onClick={() => {
                setMode('enter-email');
                setError("");
              }}
              className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
          )}
          {mode === 'access-denied' ? (
            <XCircle className="w-7 h-7 text-red-500" />
          ) : (
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          )}
        </div>

        {/* Title & Desc */}
        <h2 className="text-2xl font-bold mb-2 text-center tracking-tight">
          {mode === 'enter-email' && "Admin Access"}
          {mode === 'enter-otp' && "Verify Email"}
          {mode === 'access-denied' && "Access Denied"}
        </h2>
        <p className="text-gray-500 text-sm mb-8 text-center px-2">
          {mode === 'enter-email' && "Enter your email to receive a secure login code."}
          {mode === 'enter-otp' && `We sent a code to your email. Enter it below to proceed.`}
          {mode === 'access-denied' && `The email ${email} is not in our whitelist. Access restricted.`}
        </p>

        {/* Form */}
        {mode !== 'access-denied' ? (
          <form className="w-full flex flex-col gap-4" onSubmit={mode === 'enter-email' ? handleSendOTP : handleVerifyOTP}>

            {mode === 'enter-email' ? (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  disabled={loading}
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50/50 text-black text-[15px] transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative">
                <input
                  placeholder="0 0 0 0 0 0"
                  type="text"
                  maxLength={6}
                  value={code}
                  disabled={loading}
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50/50 text-black text-center text-2xl tracking-[0.5em] font-bold transition-all"
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="text-xs text-red-500 font-semibold px-1 text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-gray-800 to-gray-950 text-white font-semibold py-3.5 rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-white/50" /> : (
                mode === 'enter-email' ? "Send Secure Code" : "Verify & Sign In"
              )}
            </button>
          </form>
        ) : (
          <button
            onClick={() => {
              setMode('enter-email');
              setError("");
            }}
            className="w-full bg-gray-100 text-gray-900 font-semibold py-3.5 rounded-2xl hover:bg-gray-200 transition-all"
          >
            Try Another Email
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-dashed border-gray-100 w-full text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
            Secure Passwordless Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };
