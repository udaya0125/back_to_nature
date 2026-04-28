import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { User, Mail, X } from "lucide-react";
import axios from "axios";

const EditUserForm = ({ showForm, setShowForm, editingUser, onClose, onUserUpdated }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const roles = [
        { value: "Administrator", label: "Administrator" },
        { value: "Editor", label: "Editor" },
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
            name: "",
            email: "",
            role: null,
            image: null,
        },
    });

    const watchedImage = watch("image");

    useEffect(() => {
        if (editingUser) {
            setValue("name", editingUser.name);
            setValue("email", editingUser.email);
            setValue("role", roles.find(r => r.value === editingUser.role) || null);
            if (editingUser.image) {
                setImagePreview(`${imgurl}/${editingUser.image}`);
            }
        }
    }, [editingUser, setValue, imgurl]);

    useEffect(() => {
        if (!watchedImage || watchedImage.length === 0) {
            return;
        }

        const file = watchedImage[0];
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }, [watchedImage]);

    const removeImage = () => {
        setValue("image", null);
        setImageFile(null);
        if (editingUser.image) {
            setImagePreview(`${imgurl}/${editingUser.image}`);
        } else {
            setImagePreview(null);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            
            if (data.role) {
                formData.append("role", data.role.value);
            }
            
            if (imageFile) {
                formData.append("image", imageFile);
            }

            // Update existing user
            formData.append("_method", "PUT");
            await axios.post(route("ouruser.update", { id: editingUser.id }), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onUserUpdated();

            // Reset form
            reset();
            setImagePreview(null);
            setImageFile(null);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setImagePreview(null);
        setImageFile(null);
        onClose();
    };

    if (!showForm || !editingUser) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Edit User
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Full Name *
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                id="name"
                                {...register("name", { required: "Name is required" })}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter full name"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address *
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="email"
                                id="email"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter email address"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Role Selection with React Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                        </label>
                        <Controller
                            name="role"
                            control={control}
                            rules={{ required: "Role is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={roles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select role..."
                                    isSearchable={false}
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: state.isFocused
                                                ? "#3b82f6"
                                                : errors.role
                                                ? "#ef4444"
                                                : "#d1d5db",
                                            boxShadow: state.isFocused
                                                ? "0 0 0 1px #3b82f6"
                                                : "none",
                                            "&:hover": {
                                                borderColor: state.isFocused
                                                    ? "#3b82f6"
                                                    : errors.role
                                                    ? "#ef4444"
                                                    : "#d1d5db",
                                            },
                                            minHeight: "50px"
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            {...register("image")}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Remove image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                            submitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:blue-700 active:bg-blue-800"
                        }`}
                    >
                        {submitting ? "Updating..." : "Update User"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserForm;