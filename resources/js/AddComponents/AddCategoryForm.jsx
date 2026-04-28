import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCategoryForm = ({ 
  setShowForm, 
  showForm, 
  setReloadTrigger,
  onClose
}) => {
    const [categoryForm, setCategoryForm] = useState({
        category: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
      setCategoryForm({
        category: "",
      });
      setErrors({});
    }, [showForm]);

    // Validate form
    const validateForm = () => {
      const newErrors = {};
      if (!categoryForm.category.trim()) {
        newErrors.category = ["The category field is required."];
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Create new category
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourcategory.store"), formData);
            setReloadTrigger((prev) => !prev);
            return true;
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error(
                "Error creating category:",
                error.response?.data || error.message
            );
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitted(true);
        setErrors({});

        // Validate before submitting
        if (!validateForm()) {
            setIsSubmitted(false);
            return;
        }

        // Send plain JSON (no FormData needed since it's just text)
        const formData = {
            category: categoryForm.category
        };

        const success = await handleCreate(formData);
        
        if (success) {
            // Close form and reset
            onClose();
        }
        
        setIsSubmitted(false);
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[50rem] relative mx-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Add New Category
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        aria-label="Close form"
                    >
                        <X size={20} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="category"
                            value={categoryForm.category}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.category ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Enter category name"
                        />
                        {errors.category && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">
                                {errors.category[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors mt-2 sm:mt-0"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitted}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                        >
                            {isSubmitted ? "Processing..." : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryForm;