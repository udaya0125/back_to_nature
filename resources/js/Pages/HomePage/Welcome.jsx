import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    Compass,
    Leaf,
    Mountain,
    ShieldCheck,
    Trees,
    Waves,
} from "lucide-react";

const experiences = [
    {
        title: "Cultural Tours",
        description:
            "Walk through heritage towns, sacred sites, and peaceful valleys with a slower, story-rich style of travel.",
        href: "/tourpage",
        icon: Compass,
    },
    {
        title: "Epic Trekking",
        description:
            "Follow Himalayan trails, high passes, and village paths shaped by mountain life and unforgettable scenery.",
        href: "/trekkingpage",
        icon: Mountain,
    },
    {
        title: "Day Hiking",
        description:
            "Enjoy shorter escapes into forests, ridgelines, and local landscapes that fit easily into your journey.",
        href: "/hikingpage",
        icon: Trees,
    },
];

const highlights = [
    {
        title: "Nature First",
        description:
            "Built around the spirit of eco-friendly travel, inspired by Nepal's mountains, trails, forests, and rivers.",
        icon: Leaf,
    },
    {
        title: "Thoughtful Adventure",
        description:
            "Each trip balances comfort, discovery, and authentic local connection instead of rushing through destinations.",
        icon: ShieldCheck,
    },
    {
        title: "Routes For Every Pace",
        description:
            "From gentle walks to high-altitude journeys, the experience can grow with the traveler's confidence.",
        icon: Waves,
    },
];

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Back To Nature" />

            <div className="min-h-screen bg-[#f5f0e6] text-slate-900">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(98,143,91,0.22),_transparent_45%),linear-gradient(135deg,_#183628_0%,_#224735_38%,_#d8c5a2_100%)]" />
                    <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#8fb38a]/20 blur-3xl" />
                    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#e8d5b5]/25 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
                        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f3e7d3]">
                                    Back To Nature
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                                    Nature Tours & Trekking Adventures
                                </h1>
                            </div>

                            <nav className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/tourpage"
                                    className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Tours
                                </Link>
                                <Link
                                    href="/trekkingpage"
                                    className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Trekking
                                </Link>
                                <Link
                                    href="/hikingpage"
                                    className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Hiking
                                </Link>
                                {auth?.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-full bg-[#f3e7d3] px-5 py-2 text-sm font-semibold text-[#183628] transition hover:bg-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route("login")}
                                        className="rounded-full bg-[#f3e7d3] px-5 py-2 text-sm font-semibold text-[#183628] transition hover:bg-white"
                                    >
                                        Log In
                                    </Link>
                                )}
                            </nav>
                        </header>

                        <div className="grid gap-10 pb-16 pt-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pb-24 lg:pt-20">
                            <div className="max-w-3xl">
                                <p className="inline-flex rounded-full border border-[#f3e7d3]/40 bg-white/10 px-4 py-2 text-sm font-medium text-[#f5ead7] backdrop-blur-sm">
                                    Explore Nepal with greener, slower, more memorable adventures
                                </p>
                                <h2 className="mt-6 text-5xl font-semibold leading-tight text-white md:text-6xl">
                                    Discover mountain trails, local culture, and quiet landscapes.
                                </h2>
                                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#efe4d0]">
                                    This welcome page is inspired by the Back To Nature style:
                                    eco-minded travel, scenic trekking, and immersive outdoor
                                    experiences shaped by Nepal&apos;s natural beauty.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        href="/trekkingpage"
                                        className="inline-flex items-center gap-2 rounded-full bg-[#f3e7d3] px-6 py-3 text-sm font-semibold text-[#183628] transition hover:bg-white"
                                    >
                                        Start Exploring
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/tourpage"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        View Tours
                                    </Link>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                <div className="rounded-[2rem] border border-white/20 bg-[#f1e5ce] p-6 text-[#183628] shadow-2xl shadow-[#183628]/15">
                                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#54714f]">
                                        Welcome
                                    </p>
                                    <h3 className="mt-3 text-3xl font-semibold">
                                        Travel closer to the land
                                    </h3>
                                    <p className="mt-4 text-base leading-7 text-[#30513e]">
                                        A calm, earthy introduction to tours, trekking, and hiking
                                        experiences designed for travelers who want nature and meaning
                                        together.
                                    </p>
                                </div>

                                <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatCard value="3" label="Experience paths" />
                                        <StatCard value="100%" label="Nature inspired" />
                                        <StatCard value="Local" label="Travel feeling" />
                                        <StatCard value="Warm" label="Welcome style" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {experiences.map(({ title, description, href, icon: Icon }) => (
                            <Link
                                key={title}
                                href={href}
                                className="group rounded-[2rem] border border-[#d7c5a8] bg-white/80 p-7 shadow-lg shadow-[#a18b67]/10 transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f0df] text-[#2f5b40]">
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-2xl font-semibold text-[#183628]">
                                    {title}
                                </h3>
                                <p className="mt-4 leading-7 text-[#5a635c]">
                                    {description}
                                </p>
                                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f5b40]">
                                    Explore now
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="border-y border-[#d8c8ad] bg-[#efe3cd]">
                    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#627d58]">
                                About The Welcome Page
                            </p>
                            <h3 className="mt-4 text-4xl font-semibold text-[#183628]">
                                Crafted for a peaceful adventure brand.
                            </h3>
                            <p className="mt-6 text-lg leading-8 text-[#4f5f54]">
                                The layout uses warm earth tones, soft glass panels, and travel-focused
                                calls to action so the project immediately feels aligned with a nature
                                adventure company.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {highlights.map(({ title, description, icon: Icon }) => (
                                <div
                                    key={title}
                                    className="rounded-[1.75rem] border border-[#d8c8ad] bg-[#f8f2e8] p-6"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dce8d2] text-[#2f5b40]">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="mt-5 text-xl font-semibold text-[#183628]">
                                        {title}
                                    </h4>
                                    <p className="mt-3 leading-7 text-[#5a635c]">
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

const StatCard = ({ value, label }) => (
    <div className="rounded-[1.5rem] border border-white/15 bg-[#183628]/35 p-4">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="mt-1 text-sm text-[#e9dcc8]">{label}</p>
    </div>
);
