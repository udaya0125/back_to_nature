import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditTrekkingForm = ({
    showEditForm,
    onCancel,
    onSuccess,
    allTrekkingCategory,
    editingTrekking,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [itineraryItems, setItineraryItems] = useState([
        { day: "", title: "", description: "" },
    ]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
        ],
    };

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

    const {
        control,
        handleSubmit,
        watch,
        reset,
        register,
        setValue,
        getValues,
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

    useEffect(() => {
        const subscription = watch((value) => {
            console.log("Current form values:", value);
        });

        return () => subscription.unsubscribe();
    }, [watch]);

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

    // Form population effect - runs when editing data changes
    useEffect(() => {
        if (editingTrekking && showEditForm) {
            setIsFormInitialized(false);

            // Set existing images
            if (editingTrekking.images && editingTrekking.images.length > 0) {
                setExistingImages(editingTrekking.images);
            }

            // Populate form with editing trekking data
            Object.keys(editingTrekking).forEach((key) => {
                if (key === "category" && editingTrekking[key]?.id) {
                    const categoryItem = allTrekkingCategory.find(
                        (cat) => cat.id == editingTrekking[key].id
                    );
                    if (categoryItem) {
                        setValue("category", {
                            value: categoryItem.id,
                            label: categoryItem.category,
                        });
                    }
                }
                // Handle subcategory - check for both sub_category_id and sub_category
                else if (key === "sub_category_id" && editingTrekking[key]) {
                    let subCat = null;
                    for (const category of allTrekkingCategory) {
                        subCat = category.sub_categories?.find(
                            (sub) => sub.id == editingTrekking[key]
                        );
                        if (subCat) break;
                    }

                    if (subCat) {
                        setValue("sub_category", {
                            value: editingTrekking[key],
                            label: subCat.sub_category,
                        });
                    }
                } else if (key === "sub_category") {
                    if (
                        editingTrekking[key] === null ||
                        editingTrekking[key] === undefined
                    ) {
                        setValue("sub_category", null);
                    } else if (editingTrekking[key]?.id) {
                        let subCat = null;
                        for (const category of allTrekkingCategory) {
                            subCat = category.sub_categories?.find(
                                (sub) => sub.id == editingTrekking[key].id
                            );
                            if (subCat) break;
                        }

                        if (subCat) {
                            setValue("sub_category", {
                                value: subCat.id,
                                label: subCat.sub_category,
                            });
                        }
                    } else if (typeof editingTrekking[key] === "string") {
                        let subCat = null;
                        for (const category of allTrekkingCategory) {
                            subCat = category.sub_categories?.find(
                                (sub) =>
                                    sub.sub_category === editingTrekking[key]
                            );
                            if (subCat) break;
                        }

                        if (subCat) {
                            setValue("sub_category", {
                                value: subCat.id,
                                label: subCat.sub_category,
                            });
                        }
                    }
                } else if (key === "sub_category_id" && editingTrekking[key]) {
                    let subCat = null;
                    for (const category of allTrekkingCategory) {
                        subCat = category.sub_categories?.find(
                            (sub) => sub.id == editingTrekking[key]
                        );
                        if (subCat) break;
                    }

                    if (subCat) {
                        setValue("sub_category", {
                            value: subCat.id,
                            label: subCat.sub_category,
                        });
                    }
                } else if (key === "grade" && editingTrekking[key]) {
                    const gradeItem = gradeOptions.find(
                        (g) => g.value === editingTrekking[key]
                    );
                    if (gradeItem) {
                        setValue("grade", gradeItem);
                    }
                } else if (key === "season" && editingTrekking[key]) {
                    const seasonItem = seasonOptions.find(
                        (s) => s.value === editingTrekking[key]
                    );
                    if (seasonItem) {
                        setValue("season", seasonItem);
                    }
                } else if (
                    key !== "images" &&
                    key !== "itineraries" &&
                    key !== "category" &&
                    key !== "category_id" &&
                    key !== "sub_category" &&
                    key !== "sub_category_id"
                ) {
                    setValue(key, editingTrekking[key] || "");
                }
            });

            // Set itinerary items if they exist
            if (
                editingTrekking.itineraries &&
                editingTrekking.itineraries.length > 0
            ) {
                setItineraryItems(editingTrekking.itineraries);
            } else {
                setItineraryItems([{ day: "", title: "", description: "" }]);
            }

            setTimeout(() => {
                setIsFormInitialized(true);
            }, 100);
        }
    }, [editingTrekking, showEditForm, setValue, allTrekkingCategory]);

    // Clear subcategory when category changes - but only after form is initialized
    useEffect(() => {
        if (isFormInitialized && watchedCategory) {
            const currentSubCategory = getValues("sub_category");
            const availableSubCategories =
                getSubCategoryOptions(watchedCategory);

            if (
                currentSubCategory &&
                !availableSubCategories.some(
                    (sub) => sub.value === currentSubCategory.value
                )
            ) {
                setValue("sub_category", null);
            }
        }
    }, [watchedCategory, setValue, isFormInitialized, getValues]);

    // Handle image selection for preview
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);

        // Create previews for new images
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    // Remove existing image
    const removeExistingImage = (index) => {
        const updatedImages = [...existingImages];
        updatedImages.splice(index, 1);
        setExistingImages(updatedImages);
    };

    // Remove new image
    const removeNewImage = (index) => {
        const updatedImages = [...newImages];
        const updatedPreviews = [...imagePreviews];

        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setNewImages(updatedImages);
        setImagePreviews(updatedPreviews);
    };

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

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            const formData = new FormData();

            // Append basic fields
            Object.keys(data).forEach((key) => {
                if (key === "images") {
                    // Handle new images
                    if (newImages && newImages.length > 0) {
                        newImages.forEach((file, index) => {
                            formData.append(`images[${index}]`, file);
                        });
                    }
                } else if (key === "category") {
                    if (data[key]) {
                        formData.append("category_id", data[key].value);
                    }
                } else if (key === "sub_category") {
                    if (data[key]) {
                        formData.append("sub_category_id", data[key].value);
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

            // Append existing images that haven't been removed
            if (existingImages.length > 0) {
                formData.append(
                    "existing_images",
                    JSON.stringify(existingImages.map((img) => img.id))
                );
            }

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

            formData.append("_method", "PUT");
            await axios.post(
                route("ourtrekking.update", { id: editingTrekking.id }),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            onSuccess();
        } catch (error) {
            console.error("Error updating trekking", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setItineraryItems([{ day: "", title: "", description: "" }]);
        setExistingImages([]);
        setNewImages([]);
        setImagePreviews([]);
        setIsFormInitialized(false);
        onCancel();
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${
                showEditForm ? "block" : "hidden"
            }`}
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Edit Trekking
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
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        value={field.value}
                                        onChange={field.onChange}
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
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-32 mb-12"
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
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-32 mb-12"
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
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-32 mb-12"
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
                                        theme="snow"
                                        modules={quillModules}
                                        formats={quillFormats}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-32 mb-12"
                                        placeholder="Recommended clothing and gear"
                                    />
                                )}
                            />
                        </div>

                        {/* Image Upload and Preview */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images
                            </label>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Existing Images
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {existingImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className="relative"
                                            >
                                                <img
                                                    src={`${imgurl}/${image.image_path}`}
                                                    alt={`Trekking image ${
                                                        index + 1
                                                    }`}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(
                                                            index
                                                        )
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

                            {/* New Images Preview */}
                            {imagePreviews.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        New Images
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`New image ${
                                                        index + 1
                                                    }`}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(index)
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

                            {/* File Input */}
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                accept="image/*"
                                multiple
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Select new images to add to the existing ones
                            </p>
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
                                                        className="text-red-500 text-xs sm:text-sm hover:text-red-700"
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
                                                theme="snow"
                                                modules={quillModules}
                                                formats={quillFormats}
                                                value={item.description}
                                                onChange={(value) =>
                                                    updateItineraryItem(
                                                        index,
                                                        "description",
                                                        value
                                                    )
                                                }
                                                className="h-32 mb-12"
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
                            {submitting ? "Updating..." : "Update Trekking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTrekkingForm;
