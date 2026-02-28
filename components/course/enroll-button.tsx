"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/actions/enrollments";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

type EnrollButtonProps = {
  courseId: string;
  price: number;
};

export function EnrollButton({ courseId, price }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const result = await enrollInCourse(courseId);

      if (result.enrolled) {
        toast.success("Successfully enrolled!");
        router.refresh();
      } else if (result.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
        );
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: result.sessionId });
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full">
      {loading ? "Processing..." : price === 0 ? "Enroll for Free" : `Enroll for $${price}`}
    </Button>
  );
}
