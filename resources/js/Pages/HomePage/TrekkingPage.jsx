import { useState, useEffect } from "react";
import axios from "axios";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    Mountain,
    TrendingUp,
    Sun,
} from "lucide-react";

const TrekkingPage = () => {
    const [openIndex, setOpenIndex] = useState("");
    const [allTrekking, setAllTrekking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const imgurl = import.meta.env.VITE_FRONT_IMAGE_PATH;

    useEffect(() => {
        const fetchTrekkingDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourtrekking.index"));
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || [];

                if (data.length > 0) {
                    const firstTrek = data[0];
                    setAllTrekking({
                        ...firstTrek,
                        images: firstTrek.images || [],
                        itineraries: firstTrek.itineraries || [],
                        includes: firstTrek.includes || [],
                        excludes: firstTrek.excludes || [],
                        description:
                            firstTrek.description ||
                            "No description available.",
                        important_message:
                            firstTrek.important_message ||
                            "No important information provided.",
                        whatto_wear:
                            firstTrek.whatto_wear ||
                            "No recommendations provided.",
                        duration: firstTrek.duration || "N/A",
                        elevation: firstTrek.elevation || "N/A",
                        grade: firstTrek.grade || "N/A",
                        best_time: firstTrek.best_time || "N/A",
                        title: firstTrek.title || "Unnamed Trek",
                    });
                } else {
                    setError("No trekking data found");
                }
            } catch (err) {
                console.error("Error fetching trekking data:", err);
                setError("Failed to load trekking data");
            } finally {
                setLoading(false);
            }
        };

        fetchTrekkingDetails();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="text-xl">Loading trekking details...</div>
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
    if (!allTrekking) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="text-xl">No trekking data available</div>
            </div>
        );
    }

    // Toggle Accordion Section
    const toggleSection = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    console.log(allTrekking);
    return (
        <div className="container mx-auto px-4 lg:px-0">
            {/* Hero Section */}
            <div
                className="relative w-full h-[35rem] bg-cover bg-center rounded-b-2xl overflow-hidden"
                // style={{
                //     backgroundImage: `url('${imgurl}/${allTrekking?.image}')`,
                // }}
                style={{
                    backgroundImage: `url('${imgurl}/${
                        allTrekking?.images[0]?.image_path || ""
                    }')`,
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
                        {allTrekking.title}
                    </h1>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 my-8 lg:px-10">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Image Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {allTrekking?.images?.map((image, index) => (
                            <div key={index}>
                                <div className="md:col-span-2">
                                    <img
                                        src={`${imgurl}/${image.image_path}`}
                                        alt="Main View"
                                        className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-md"
                                    />
                                </div>
                                {/* <div className="grid grid-cols-1 gap-4">
                                    <img
                                        src={image.images[1]}
                                        alt="Secondary View"
                                        className="w-full h-36 object-cover rounded-2xl shadow-sm"
                                    />
                                    <img
                                        src={image.image[2]}
                                        alt="Tertiary View"
                                        className="w-full h-36 object-cover rounded-2xl shadow-sm"
                                    />
                                </div> */}
                            </div>
                        ))}
                        {/* <div className="md:col-span-2">
                            <img
                                src={allTrekking.images[0]}
                                alt="Main View"
                                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-md"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <img
                                src={allTrekking.images[1]}
                                alt="Secondary View"
                                className="w-full h-36 object-cover rounded-2xl shadow-sm"
                            />
                            <img
                                src={
                                    allTrekking.images[2] ||
                                    allTrekking.images[0]
                                }
                                alt="Tertiary View"
                                className="w-full h-36 object-cover rounded-2xl shadow-sm"
                            />
                        </div> */}
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
                                        {allTrekking.title}
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
                                            {allTrekking.description}
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
                                        {allTrekking.itineraries.map(
                                            (day, index) => (
                                                <div
                                                    key={index}
                                                    className="flex"
                                                >
                                                    <div className="flex flex-col items-center mr-4">
                                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                            <span className="text-green-700 font-semibold">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        {index <
                                                            allTrekking
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
                                    <p>{allTrekking.includes}</p>
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
                                    <p>{allTrekking.excludes}</p>
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
                                            {allTrekking.important_message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* What to Wear/Bring */}
                            <div className="py-6">
                                <button
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                    onClick={() => toggleSection(5)}
                                    aria-expanded={openIndex === 5}
                                >
                                    <h2 className="text-xl font-semibold">
                                        What to Wear/Bring
                                    </h2>
                                    {openIndex === 5 ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                                {openIndex === 5 && (
                                    <p className="text-gray-700 mt-4 leading-relaxed">
                                        {allTrekking.whatto_wear}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Travel Details Sidebar */}
                <div className="w-full lg:w-[350px] lg:sticky lg:top-24 h-fit border border-gray-200 rounded-xl shadow-md p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Travel Details
                    </h2>

                    <div className="space-y-5">
                        <DetailItem
                            icon={<Clock className="w-6 h-6 text-green-700" />}
                            bgColor="bg-green-100"
                            label="Duration"
                            value={allTrekking.duration}
                        />

                        <DetailItem
                            icon={
                                <Mountain className="w-6 h-6 text-blue-700" />
                            }
                            bgColor="bg-blue-100"
                            label="Max Elevation"
                            value={allTrekking.elevation}
                        />

                        <DetailItem
                            icon={
                                <TrendingUp className="w-6 h-6 text-yellow-700" />
                            }
                            bgColor="bg-yellow-100"
                            label="Trip Grade"
                            value={allTrekking.grade}
                        />

                        <DetailItem
                            icon={<Sun className="w-6 h-6 text-purple-700" />}
                            bgColor="bg-purple-100"
                            label="Best Season"
                            value={allTrekking.best_time}
                        />
                    </div>
                </div>
            </div>
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

export default TrekkingPage;
