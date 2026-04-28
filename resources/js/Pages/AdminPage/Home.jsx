import AdminWrapper from "@/AdminComponents/AdminWrapper";
import React from "react";
import { Mountain, Compass, Map } from "lucide-react"; // icons
import { Link } from "@inertiajs/react";

const Home = () => {
    return (
        <AdminWrapper>
            <div className="flex flex-col gap-4 p-6 w-[15rem]">
                <Link href={'/trekkingpage'} className="flex items-center gap-3 bg-red-500 text-white font-medium px-6 py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                    <Mountain className="w-6 h-6" />
                    <span>Trekking</span>
                </Link>
                <Link href={'/tourpage'} className="flex items-center gap-3 bg-red-500 text-white font-medium px-6 py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                    <Map className="w-6 h-6" />
                    <span>Tour</span>
                </Link>
                <Link href={'/hikingpage'} className="flex items-center gap-3 bg-red-500 text-white font-medium px-6 py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                    <Compass className="w-6 h-6" />
                    <span>Hiking</span>
                </Link>
            </div>
        </AdminWrapper>
    );
};

export default Home;
