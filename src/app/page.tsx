import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { HomeFeaturedGear } from "@/components/gear/home-featured-gear";
import { HomeCategories } from "@/components/gear/home-categories";

export default function HomePage() {
  return (
    <div>
      <section className="from-primary/10 to-base-100 border-base-300 border-b bg-gradient-to-b">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Rent sports & outdoor gear,
            <br className="hidden md:block" /> <span className="text-primary">not buy it</span>
          </h1>
          <p className="text-base-content/70 mx-auto mt-4 max-w-xl">
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

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3">
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <Sparkles className="size-6" />
          </div>
          <h3 className="font-semibold">Quality gear, vetted providers</h3>
          <p className="text-base-content/60 text-sm">
            Every listing is reviewed by real renters, so you know what you&apos;re getting.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <Wallet className="size-6" />
          </div>
          <h3 className="font-semibold">Secure online payment</h3>
          <p className="text-base-content/60 text-sm">
            Pay safely via SSLCommerz - cards, mobile banking, and more.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="font-semibold">Track every rental</h3>
          <p className="text-base-content/60 text-sm">
            From order placed to returned, follow your rental status end to end.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-xl font-bold">Browse by category</h2>
        <HomeCategories />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 pb-16">
        <div className="mb-4 flex items-center justify-between">
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
