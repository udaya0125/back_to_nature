import { X } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import Select from 'react-select';
import axios from "axios";

const EditSubCategoryForm = ({ 
    showForm, 
    setShowForm, 
    allCategory, 
    setReloadTrigger, 
    editingSubCategory, 
    setEditingSubCategory 
}) => {
    const [subCategoryForm, setSubCategoryForm] = useState({
        category_id: "",
        sub_category: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Transform allCategory into react-select options
    const categoryOptions = useMemo(() => {
        return allCategory.map(category => ({
            value: category.id,
            label: category.category,
        }));
    }, [allCategory]);

    useEffect(() => {
        if (editingSubCategory && showForm) {
            setSubCategoryForm({
                category_id: editingSubCategory.category_id,
                sub_category: editingSubCategory.sub_category || "",
            });
            setErrors({});
        }
    }, [editingSubCategory, showForm]);

    const handleCategoryChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : "";
        setSubCategoryForm((prev) => ({
            ...prev,
            category_id: value,
        }));

        if (errors.category_id) {
            setErrors(prev => ({
                ...prev,
                category_id: null
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({
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

    const handleUpdate = async (formData) => {
        try {
            await axios.put(
                route("subcategory.update", { id: editingSubCategory.id }),
                formData
            );
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error(
                "Error updating subcategory:",
                error.response?.data || error.message
            );
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setErrors({});

        const formData = {
            category_id: subCategoryForm.category_id,
            sub_category: subCategoryForm.sub_category
        };

        try {
            await handleUpdate(formData);
            setEditingSubCategory(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error updating subcategory:", error);
        } finally {
            setIsSubmitted(false);
        }
    };

    const handleClose = () => {
        setEditingSubCategory(null);
        setSubCategoryForm({ category_id: "", sub_category: "" });
        setErrors({});
        setShowForm(false);
    };

    const selectedCategoryOption = useMemo(() => {
        if (!subCategoryForm.category_id) return null;
        return categoryOptions.find(option => option.value.toString() === subCategoryForm.category_id.toString());
    }, [subCategoryForm.category_id, categoryOptions]);

    if (!showForm || !editingSubCategory) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[50rem]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Edit Sub-Category
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <Select
                            options={categoryOptions}
                            value={selectedCategoryOption}
                            onChange={handleCategoryChange}
                            placeholder="Select Category"
                            isClearable
                            className={`react-select-container ${errors.category_id ? 'border-red-500' : ''}`}
                            classNamePrefix="react-select"
                        />
                        {errors.category_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.category_id[0]}</p>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub Category Name
                        </label>
                        <input
                            type="text"
                            name="sub_category"
                            value={subCategoryForm.sub_category}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.sub_category 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Enter sub category name"
                        />
                        {errors.sub_category && (
                            <p className="mt-1 text-sm text-red-600">{errors.sub_category[0]}</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitted}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitted ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubCategoryForm;