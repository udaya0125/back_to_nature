import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddTrekkingForm = ({
    showAddForm,
    onCancel,
    onSuccess,
    allTrekkingCategory,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [itineraryItems, setItineraryItems] = useState([
        { day: "", title: "", description: "" },
    ]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Define season options
    const seasonOptions = [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "autumn", label: "Autumn" },
        { value: "winter", label: "Winter" },
        { value: "year-round", label: "Year-Round" },
    ];

    // Grade options
    const gradeOptions = [
        { value: "easy", label: "Easy" },
        { value: "moderate", label: "Moderate" },
        { value: "difficult", label: "Difficult" },
        { value: "strenuous", label: "Strenuous" },
    ];

    // Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
        ],
    };

    // Quill formats
    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "link",
    ];

    const {
        control,
        handleSubmit,
        watch,
        reset,
        register,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            category: null,
            sub_category: null,
            description: "",
            images: [],
            includes: "",
            excludes: "",
            important_message: "",
            best_time: "",
            whatto_wear: "",
            duration: "",
            elevation: "",
            grade: null,
            season: null,
        },
    });

    const watchedCategory = watch("category");
    const watchedImages = watch("images");

    // Extract unique categories from allTrekkingCategory
    const categoryOptions = allTrekkingCategory.map((item) => ({
        value: item.id,
        label: item.category,
    }));

    // Get subcategories based on selected category
    const getSubCategoryOptions = (selectedCategory) => {
        if (!selectedCategory) return [];

        const selectedCategoryData = allTrekkingCategory.find(
            (item) => item.id === selectedCategory.value
        );

        if (
            selectedCategoryData &&
            selectedCategoryData.sub_categories.length > 0
        ) {
            return selectedCategoryData.sub_categories.map((sub) => ({
                value: sub.id,
                label: sub.sub_category,
            }));
        }

        return [];
    };

    useEffect(() => {
        // Reset form when component mounts or showAddForm changes
        if (showAddForm) {
            reset();
            setItineraryItems([{ day: "", title: "", description: "" }]);
            setImagePreviews([]);
        }
    }, [showAddForm, reset]);

    // Handle image previews
    useEffect(() => {
        if (watchedImages && watchedImages.length > 0) {
            const files = Array.from(watchedImages);
            const newImagePreviews = [];

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newImagePreviews.push(e.target.result);
                    if (newImagePreviews.length === files.length) {
                        setImagePreviews(newImagePreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setImagePreviews([]);
        }
    }, [watchedImages]);

    const addItineraryItem = () => {
        setItineraryItems([
            ...itineraryItems,
            { day: "", title: "", description: "" },
        ]);
    };

    const removeItineraryItem = (index) => {
        if (itineraryItems.length === 1) return;
        const newItems = [...itineraryItems];
        newItems.splice(index, 1);
        setItineraryItems(newItems);
    };

    const updateItineraryItem = (index, field, value) => {
        const newItems = [...itineraryItems];
        newItems[index][field] = value;
        setItineraryItems(newItems);
    };

    const removeImage = (index) => {
        const newFiles = Array.from(watchedImages);
        newFiles.splice(index, 1);

        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        newFiles.forEach((file) => dataTransfer.items.add(file));

        // Update the form value
        setValue("images", dataTransfer.files);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            const formData = new FormData();

            // Append basic fields
            Object.keys(data).forEach((key) => {
                if (key === "images") {
                    if (data.images && data.images.length > 0) {
                        const files =
                            data.images instanceof FileList
                                ? Array.from(data.images)
                                : data.images;

                        files.forEach((file, index) => {
                            formData.append(`images[${index}]`, file);
                        });
                    }
                } else if (key === "category") {
                    if (data[key]) {
                        formData.append("category_id", data[key].value); // Send as category_id
                    }
                } else if (key === "sub_category") {
                    if (data[key]) {
                        formData.append("sub_category_id", data[key].value); // Send as sub_category_id
                    }
                } else if (key === "grade" || key === "season") {
                    if (data[key]) {
                        formData.append(key, data[key].value);
                    }
                } else if (key !== "images" && key !== "itineraries") {
                    const value = data[key];
                    if (value !== null && value !== undefined) {
                        formData.append(key, String(value));
                    }
                }
            });

            // Append itinerary items
            itineraryItems.forEach((item, index) => {
                if (item.day && item.title) {
                    formData.append(
                        `itineraries[${index}][day]`,
                        String(item.day)
                    );
                    formData.append(
                        `itineraries[${index}][title]`,
                        String(item.title)
                    );
                    formData.append(
                        `itineraries[${index}][description]`,
                        String(item.description || "")
                    );
                }
            });

            await axios.post(route("ourtrekking.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onSuccess();
        } catch (error) {
            console.error("Error saving trekking", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setItineraryItems([{ day: "", title: "", description: "" }]);
        setImagePreviews([]);
        onCancel();
    };

    // Clear subcategory when category changes
    useEffect(() => {
        if (watchedCategory) {
            setValue("sub_category", null); // Reset subcategory on category change
        }
    }, [watchedCategory, setValue]);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${
                showAddForm ? "block" : "hidden"
            }`}
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Add Trekking
                    </h1>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trekking Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", {
                                    required: "Trekking title is required",
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={categoryOptions}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select category..."
                                    />
                                )}
                            />
                        </div>

                        {/* Sub Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Category
                            </label>
                            <Controller
                                name="sub_category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={getSubCategoryOptions(
                                            watchedCategory
                                        )}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isDisabled={!watchedCategory}
                                        isClearable
                                        placeholder="Select sub category..."
                                    />
                                )}
                            />
                        </div>

                        {/* Grade */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grade
                            </label>
                            <Controller
                                name="grade"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={gradeOptions}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select grade..."
                                    />
                                )}
                            />
                        </div>

                        {/* Season */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Season
                            </label>
                            <Controller
                                name="season"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={seasonOptions}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select season..."
                                    />
                                )}
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <input
                                type="text"
                                {...register("duration")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 5 Days 4 Nights"
                            />
                        </div>

                        {/* Elevation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Highest Elevation
                            </label>
                            <input
                                type="text"
                                {...register("elevation")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 4,130m"
                            />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        onChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                        className="h-40 mb-12"
                                    />
                                )}
                            />
                        </div>

                        {/* Includes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                What's Included
                            </label>
                            <Controller
                                name="includes"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        onChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                        className="h-32 mb-10"
                                    />
                                )}
                            />
                        </div>

                        {/* Excludes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                What's Excluded
                            </label>
                            <Controller
                                name="excludes"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        onChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                        className="h-32 mb-10"
                                    />
                                )}
                            />
                        </div>

                        {/* Important Message */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Important Message
                            </label>
                            <Controller
                                name="important_message"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        onChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                        className="h-32 mb-10"
                                        placeholder="Any important information for trekkers"
                                    />
                                )}
                            />
                        </div>

                        {/* Best Time to Visit */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Best Time to Visit
                            </label>
                            <input
                                type="text"
                                {...register("best_time")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., October to March"
                            />
                        </div>

                        {/* What to Wear */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                What to Wear
                            </label>
                            <Controller
                                name="whatto_wear"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        onChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                        className="h-32 mb-10"
                                        placeholder="Recommended clothing and gear"
                                    />
                                )}
                            />
                        </div>

                        {/* Image File */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images
                            </label>
                            <input
                                type="file"
                                {...register("images")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                accept="image/*"
                                multiple
                            />

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected Images:
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Itinerary Section */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Itinerary
                            </label>
                            <div className="space-y-3">
                                {itineraryItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border p-3 rounded-md"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Day
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.day}
                                                    onChange={(e) =>
                                                        updateItineraryItem(
                                                            index,
                                                            "day",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Day 1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) =>
                                                        updateItineraryItem(
                                                            index,
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Activity title"
                                                />
                                            </div>
                                            {itineraryItems.length > 1 && (
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItineraryItem(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500 text-xs sm:text-sm hover:text-red-700 mt-2"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                            {/* <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItineraryItem(
                                                            index
                                                        )
                                                    }
                                                    className="text-red-500 text-sm hover:text-red-700"
                                                    disabled={
                                                        itineraryItems.length ===
                                                        1
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div> */}
                                        </div>
                                        <div className="mt-2">
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Description
                                            </label>
                                            <ReactQuill
                                                value={item.description}
                                                onChange={(value) =>
                                                    updateItineraryItem(
                                                        index,
                                                        "description",
                                                        value
                                                    )
                                                }
                                                modules={quillModules}
                                                formats={quillFormats}
                                                theme="snow"
                                                className="h-32 mb-10"
                                                placeholder="Detailed description"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addItineraryItem}
                                    className="text-blue-500 text-sm hover:text-blue-700 mt-2"
                                >
                                    + Add Another Day
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Add Trekking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTrekkingForm;
