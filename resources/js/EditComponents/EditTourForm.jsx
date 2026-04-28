import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditTourForm = ({
    showForm,
    onCancel,
    allCategory,
    onSuccess,
    editingTour,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [itineraryItems, setItineraryItems] = useState([
        { day: "", title: "", description: "" },
    ]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(
        window.innerWidth >= 768 && window.innerWidth < 1024
    );
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Define season options
    const seasonOptions = [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "autumn", label: "Autumn" },
        { value: "winter", label: "Winter" },
        { value: "year-round", label: "Year-Round" },
    ];

    // Tour type options
    const tourTypeOptions = [
        { value: "domestic", label: "Domestic" },
        { value: "international", label: "International" },
    ];

    // React Quill modules configuration - simplified for mobile
    const quillModules = {
        toolbar: isMobile
            ? [["bold", "italic", "underline"], ["link"]]
            : [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["link"],
                  ["clean"],
              ],
    };

    const quillFormats = isMobile
        ? ["bold", "italic", "underline", "link"]
        : [
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
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            category: null,
            sub_category: null,
            tour_type: null,
            description: "",
            images: [],
            includes: "",
            excludes: "",
            important_message: "",
            best_time: "",
            duration: "",
            city_covered: "",
            season: null,
            things_to_remember: "", // Added field
            terms_for_booking: "", // Added field
        },
    });

    const watchedCategory = watch("category");

    useEffect(() => {
        const subscription = watch((value) => {
            console.log("Current form values:", value);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // Extract unique categories from allCategory
    const categoryOptions = allCategory.map((item) => ({
        value: item.id,
        label: item.category,
    }));

    // Get subcategories based on selected category
    const getSubCategoryOptions = (selectedCategory) => {
        if (!selectedCategory) return [];
        const selectedCategoryData = allCategory.find(
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
        if (editingTour && showForm) {
            setIsFormInitialized(false);

            // Set existing images
            if (editingTour.images && editingTour.images.length > 0) {
                setExistingImages(editingTour.images);
            }

            // Populate form with editing tour data
            Object.keys(editingTour).forEach((key) => {
                if (key === "category_id" && editingTour[key]) {
                    const categoryItem = allCategory.find(
                        (cat) => cat.id == editingTour[key]
                    );
                    if (categoryItem) {
                        setValue("category", {
                            value: categoryItem.id,
                            label: categoryItem.category,
                        });
                    }
                }
                // Handle subcategory - check for both sub_category_id and sub_category
                else if (key === "sub_category_id" && editingTour[key]) {
                    let subCat = null;
                    for (const category of allCategory) {
                        subCat = category.sub_categories?.find(
                            (sub) => sub.id == editingTour[key]
                        );
                        if (subCat) break;
                    }
                    if (subCat) {
                        setValue("sub_category", {
                            value: editingTour[key],
                            label: subCat.sub_category,
                        });
                    }
                } else if (key === "sub_category") {
                    if (
                        editingTour[key] === null ||
                        editingTour[key] === undefined
                    ) {
                        setValue("sub_category", null);
                    } else if (editingTour[key]?.id) {
                        let subCat = null;
                        for (const category of allCategory) {
                            subCat = category.sub_categories?.find(
                                (sub) => sub.id == editingTour[key].id
                            );
                            if (subCat) break;
                        }
                        if (subCat) {
                            setValue("sub_category", {
                                value: subCat.id,
                                label: subCat.sub_category,
                            });
                        }
                    } else if (typeof editingTour[key] === "string") {
                        let subCat = null;
                        for (const category of allCategory) {
                            subCat = category.sub_categories?.find(
                                (sub) => sub.sub_category === editingTour[key]
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
                } else if (key === "tour_type" && editingTour[key]) {
                    const tourTypeItem = tourTypeOptions.find(
                        (t) => t.value === editingTour[key]
                    );
                    if (tourTypeItem) {
                        setValue("tour_type", tourTypeItem);
                    }
                } else if (key === "season" && editingTour[key]) {
                    const seasonItem = seasonOptions.find(
                        (s) => s.value === editingTour[key]
                    );
                    if (seasonItem) {
                        setValue("season", seasonItem);
                    }
                } else if (
                    key !== "images" &&
                    key !== "itinerary" &&
                    key !== "category" &&
                    key !== "category_id" &&
                    key !== "sub_category" &&
                    key !== "sub_category_id"
                ) {
                    setValue(key, editingTour[key] || "");
                }
            });

            // Set itinerary items if they exist
            if (editingTour.itinerary && editingTour.itinerary.length > 0) {
                setItineraryItems(editingTour.itinerary);
            } else {
                setItineraryItems([{ day: "", title: "", description: "" }]);
            }

            setTimeout(() => {
                setIsFormInitialized(true);
            }, 100);
        }
    }, [editingTour, showForm, setValue, allCategory]);

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
                } else if (key === "tour_type" || key === "season") {
                    if (data[key]) {
                        formData.append(key, data[key].value);
                    }
                } else if (key !== "images" && key !== "itinerary") {
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
                        `itinerary[${index}][day]`,
                        String(item.day)
                    );
                    formData.append(
                        `itinerary[${index}][title]`,
                        String(item.title)
                    );
                    formData.append(
                        `itinerary[${index}][description]`,
                        String(item.description || "")
                    );
                }
            });

            formData.append("_method", "PUT");

            await axios.post(
                route("ourtour.update", { id: editingTour.id }),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            onSuccess();
        } catch (error) {
            console.error("Error updating tour", error);
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
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 ${
                showForm ? "block" : "hidden"
            }`}
        >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        Edit Tour
                    </h1>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                    >
                        <X size={isMobile ? 20 : 24} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 sm:space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* Title */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tour Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", {
                                    required: "Tour title is required",
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
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
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select category..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
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
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isDisabled={!watchedCategory}
                                        isClearable
                                        placeholder="Select sub category..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
                                    />
                                )}
                            />
                        </div>

                        {/* Tour Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tour Type
                            </label>
                            <Controller
                                name="tour_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={tourTypeOptions}
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select tour type..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
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
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select season..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
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
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., 5 Days 4 Nights"
                            />
                        </div>

                        {/* Cities Covered */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cities Covered
                            </label>
                            <input
                                type="text"
                                {...register("city_covered")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="Enter cities separated by commas"
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
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-32 sm:h-40 mb-8 sm:mb-12"
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
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-28 sm:h-32 mb-8 sm:mb-10"
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
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-28 sm:h-32 mb-8 sm:mb-10"
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
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-28 sm:h-32 mb-8 sm:mb-10"
                                    />
                                )}
                            />
                        </div>

                        {/* Things to Remember */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Things to Remember
                            </label>
                            <Controller
                                name="things_to_remember"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-28 sm:h-32 mb-8 sm:mb-10"
                                    />
                                )}
                            />
                        </div>

                        {/* Terms for Booking */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Terms for Booking
                            </label>
                            <Controller
                                name="terms_for_booking"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-28 sm:h-32 mb-8 sm:mb-10"
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
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., October to March"
                            />
                        </div>

                        {/* Image Upload and Preview */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images
                            </label>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-3 sm:mb-4">
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
                                                    alt={`Tour image ${
                                                        index + 1
                                                    }`}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1"
                                                >
                                                    <X
                                                        size={
                                                            isMobile ? 10 : 14
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images Preview */}
                            {imagePreviews.length > 0 && (
                                <div className="mb-3 sm:mb-4">
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
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(index)
                                                    }
                                                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1"
                                                >
                                                    <X
                                                        size={
                                                            isMobile ? 10 : 14
                                                        }
                                                    />
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
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
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
                            <div className="space-y-2 sm:space-y-3">
                                {itineraryItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border p-2 sm:p-3 rounded-md"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
                                                    className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
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
                                                    className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
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
                                                    className="text-red-500 text-xs sm:text-sm hover:text-red-700"
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
                                                className="h-28 sm:h-32 mb-8 sm:mb-10"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addItineraryItem}
                                    className="text-blue-500 text-xs sm:text-sm hover:text-blue-700 mt-1 sm:mt-2"
                                >
                                    + Add Another Day
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-3 sm:pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 mb-2 sm:mb-0"
                        >
                            {submitting ? "Updating..." : "Update Tour"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTourForm;
