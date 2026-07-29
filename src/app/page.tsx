import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { HomeFeaturedGear } from "@/components/gear/home-featured-gear";
import { HomeCategories } from "@/components/gear/home-categories";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary/10 to-base-100 border-b border-base-300">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Rent sports & outdoor gear,
            <br className="hidden md:block" /> <span className="text-primary">not buy it</span>
          </h1>
          <p className="mt-4 text-base-content/70 max-w-xl mx-auto">
            Tents, kayaks, bikes, and more from local providers across Bangladesh. Pay securely
            online, pick up, and get outdoors.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/gear" className="btn btn-primary btn-lg">
              Browse Gear
              <ArrowRight className="size-5" />
            </Link>
            <Link href="/auth/register" className="btn btn-outline btn-lg">
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center gap-2 p-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <h3 className="font-semibold">Quality gear, vetted providers</h3>
          <p className="text-sm text-base-content/60">
            Every listing is reviewed by real renters, so you know what you&apos;re getting.
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 p-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Wallet className="size-6" />
          </div>
          <h3 className="font-semibold">Secure online payment</h3>
          <p className="text-sm text-base-content/60">
            Pay safely via SSLCommerz - cards, mobile banking, and more.
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 p-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="font-semibold">Track every rental</h3>
          <p className="text-sm text-base-content/60">
            From order placed to returned, follow your rental status end to end.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Browse by category</h2>
        <HomeCategories />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular gear</h2>
          <Link href="/gear" className="link link-primary text-sm font-medium">
            View all
          </Link>
        </div>
        <HomeFeaturedGear />
      </section>
    </div>
  );
}
