import { useState, useEffect } from "react";
import axios from "axios";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    MapPin,
    Calendar,
    Sun,
} from "lucide-react";

const TourPage = () => {
    const [openIndex, setOpenIndex] = useState("");
    const [allTour, setAllTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const imgurl = import.meta.env.VITE_FRONT_IMAGE_PATH;

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourtour.index"));
                const ourtour = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || [];
                    
                if (ourtour.length > 0) {
                    const firstTour = ourtour[0];
                    setAllTour({
                        ...firstTour,
                        images: firstTour.images || [],
                        itineraries: firstTour.itinerary || [],
                        includes: firstTour.includes || [],
                        excludes: firstTour.excludes || [],
                        description: firstTour.description || "No description available.",
                        important_message: firstTour.important_message || "No important information provided.",
                        things_to_remember: firstTour.things_to_remember || "No recommendations provided.",
                        duration: firstTour.duration || "N/A",
                        city_covered: firstTour.city_covered || "N/A",
                        best_time: firstTour.best_time || "N/A",
                        season: firstTour.season || "N/A",
                        tour_type: firstTour.tour_type || "N/A",
                        terms_for_booking: firstTour.terms_for_booking || "No terms provided.",
                        title: firstTour.title || "Unnamed Tour",
                    });
                } else {
                    setError("No tour data found");
                }
            } catch (err) {
                console.error("Error fetching tour data:", err);
                setError("Failed to load tour data");
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="text-xl">Loading tour details...</div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    // No Data State
    if (!allTour) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="text-xl">No tour data available</div>
            </div>
        );
    }

    // Toggle Accordion Section
    const toggleSection = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 lg:px-0">
            {/* Hero Section */}
            <div
                className="relative w-full h-[35rem] bg-cover bg-center rounded-b-2xl overflow-hidden"
                // style={{
                //     backgroundImage: `url('${imgurl}/${allTour?.image}')`,
                // }}
                style={{
                    backgroundImage: `url('${imgurl}/${
                        allTour?.images[0]?.image_path || ""
                    }')`,
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
                        {allTour.title}
                    </h1>
                   
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 my-8 lg:px-10">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Image Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {allTour?.images?.map((image, index) => (
                            <div key={index} className="h-64">
                                <img
                                    src={`${imgurl}/${image.image_path}`}
                                    alt={`Tour view ${index + 1}`}
                                    className="w-full h-full object-cover rounded-2xl shadow-md"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Accordion Sections */}
                    <div className="border border-gray-200 rounded-xl shadow-md p-8 mb-8">
                        <div className="divide-y divide-gray-200">
                            {/* Overview */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(0)}
                                    aria-expanded={openIndex === 0}
                                >
                                    <h2 className="text-xl font-semibold">
                                        {allTour.title} Overview
                                    </h2>
                                    {openIndex === 0 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 0 && (
                                    <div className="mt-4">
                                        <p className="text-gray-700 leading-relaxed">
                                            {allTour.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Itinerary */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(1)}
                                    aria-expanded={openIndex === 1}
                                >
                                    <h2 className="text-xl font-semibold">
                                        Itinerary
                                    </h2>
                                    {openIndex === 1 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 1 && (
                                    <div className="space-y-6 mt-4">
                                        {allTour.itineraries.map(
                                            (day, index) => (
                                                <div
                                                    key={index}
                                                    className="flex"
                                                >
                                                    <div className="flex flex-col items-center mr-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-700 font-semibold">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        {index <
                                                            allTour
                                                                .itineraries
                                                                .length -
                                                                1 && (
                                                            <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-6">
                                                        <h3 className="font-semibold text-gray-800">
                                                            Day {index + 1}:{" "}
                                                            {day.title ||
                                                                `Day ${
                                                                    index + 1
                                                                }`}
                                                        </h3>
                                                        <p className="text-gray-600 mt-1">
                                                            {day.description ||
                                                                "No description available."}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* What's Included */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(2)}
                                    aria-expanded={openIndex === 2}
                                >
                                    <h2 className="text-xl font-semibold">
                                        What's Included
                                    </h2>
                                    {openIndex === 2 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 2 && (
                                    <div className="mt-4">
                                        <ul className="list-disc pl-5 text-gray-700">
                                            {Array.isArray(allTour.includes) ? (
                                                allTour.includes.map((item, index) => (
                                                    <li key={index} className="mb-2">
                                                        {item}
                                                    </li>
                                                ))
                                            ) : (
                                                <p>{allTour.includes}</p>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* What's Excluded */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(3)}
                                    aria-expanded={openIndex === 3}
                                >
                                    <h2 className="text-xl font-semibold">
                                        Excludes
                                    </h2>
                                    {openIndex === 3 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 3 && (
                                    <div className="mt-4">
                                        <ul className="list-disc pl-5 text-gray-700">
                                            {Array.isArray(allTour.excludes) ? (
                                                allTour.excludes.map((item, index) => (
                                                    <li key={index} className="mb-2">
                                                        {item}
                                                    </li>
                                                ))
                                            ) : (
                                                <p>{allTour.excludes}</p>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Important Information */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(4)}
                                    aria-expanded={openIndex === 4}
                                >
                                    <h2 className="text-xl font-semibold">
                                        Important Information
                                    </h2>
                                    {openIndex === 4 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 4 && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                                        <p className="text-blue-800">
                                            {allTour.important_message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Things to Remember */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(5)}
                                    aria-expanded={openIndex === 5}
                                >
                                    <h2 className="text-xl font-semibold">
                                        Things to Remember
                                    </h2>
                                    {openIndex === 5 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 5 && (
                                    <div className="mt-4">
                                        <ul className="list-disc pl-5 text-gray-700">
                                            {Array.isArray(allTour.things_to_remember) ? (
                                                allTour.things_to_remember.map((item, index) => (
                                                    <li key={index} className="mb-2">
                                                        {item}
                                                    </li>
                                                ))
                                            ) : (
                                                <p>{allTour.things_to_remember}</p>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Terms for Booking */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(6)}
                                    aria-expanded={openIndex === 6}
                                >
                                    <h2 className="text-xl font-semibold">
                                        Terms for Booking
                                    </h2>
                                    {openIndex === 6 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 6 && (
                                    <div className="mt-4">
                                        <ul className="list-disc pl-5 text-gray-700">
                                            {Array.isArray(allTour.terms_for_booking) ? (
                                                allTour.terms_for_booking.map((item, index) => (
                                                    <li key={index} className="mb-2">
                                                        {item}
                                                    </li>
                                                ))
                                            ) : (
                                                <p>{allTour.terms_for_booking}</p>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Travel Details Sidebar */}
                <div className="w-full lg:w-[350px] lg:sticky lg:top-24 h-fit border border-gray-200 rounded-xl shadow-md p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Tour Details
                    </h2>

                    <div className="space-y-5">
                        <DetailItem
                            icon={<Clock className="w-6 h-6 text-blue-700" />}
                            bgColor="bg-blue-100"
                            label="Duration"
                            value={allTour.duration}
                        />

                        <DetailItem
                            icon={
                                <MapPin className="w-6 h-6 text-green-700" />
                            }
                            bgColor="bg-green-100"
                            label="Cities Covered"
                            value={allTour.city_covered}
                        />

                        <DetailItem
                            icon={
                                <Calendar className="w-6 h-6 text-purple-700" />
                            }
                            bgColor="bg-purple-100"
                            label="Best Time to Visit"
                            value={allTour.best_time}
                        />

                        <DetailItem
                            icon={<Sun className="w-6 h-6 text-yellow-700" />}
                            bgColor="bg-yellow-100"
                            label="Season"
                            value={allTour.season}
                        />

                        <DetailItem
                            icon={<MapPin className="w-6 h-6 text-red-700" />}
                            bgColor="bg-red-100"
                            label="Tour Type"
                            value={allTour.tour_type}
                        />
                    </div>
                </div>
               
            </div>

            {/* <div className="flex justify-center items-center flex-col gap-4">
                <h2 className="text-xl font-medium">Important Message</h2>
                <p className="text-2xl font-normal">{allTour.important_message}</p>
            </div> */}
        </div>
    );
};

// Reusable Detail Item Component
const DetailItem = ({ icon, bgColor, label, value }) => (
    <div className="flex items-start">
        <div className={`${bgColor} p-2 rounded-lg mr-4`}>{icon}</div>
        <div>
            <h3 className="font-medium text-gray-600">{label}</h3>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    </div>
);

export default TourPage;