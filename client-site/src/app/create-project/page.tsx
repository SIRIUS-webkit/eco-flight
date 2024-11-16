"use client";
import Button from "@/components/common/Button";
import MaxWrapper from "@/components/common/MaxWrapper";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormInputs {
  name: string;
  description: string;
  totalFundsRequired: number;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  minDonation: number;
  maxDonation: number;
}

interface MediaFile {
  url: string;
  public_id: string;
}

const CreateProjectForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setMediaFile({ url: data.url, public_id: data.public_id });
      setMediaPreview(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlertMessage("Error uploading image");
      setAlertType("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleImageDelete = async () => {
    if (!mediaFile) return;

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: mediaFile.public_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setMediaFile(null);
      setMediaPreview("");
    } catch (error) {
      console.error("Error deleting image:", error);
      setAlertMessage("Error deleting image");
      setAlertType("error");
    }
  };

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setLoading(true);
      setAlertMessage(null);

      // Assume contract interaction or API call here
      console.log("Form Data Submitted:", data, mediaFile);

      setAlertMessage("Project created successfully!");
      setAlertType("success");

      reset();
      setMediaFile(null);
      setMediaPreview("");
    } catch (error) {
      console.error("Error creating project:", error);
      setAlertMessage("Failed to create project. Please try again.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-[990px] mx-auto space-y-4 p-4 bg-base-200 shadow-md rounded-md my-10"
      >
        {/* Project Name */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Project Name</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Project Name is required" })}
            className="input input-bordered"
            placeholder="Enter project name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Description</span>
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="textarea textarea-bordered"
            placeholder="Enter project description"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Total Funds Required */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Total Funds Required (ETH)</span>
          </label>
          <input
            type="number"
            step="any"
            {...register("totalFundsRequired", {
              required: "Total Funds Required is required",
              valueAsNumber: true,
              validate: (value) =>
                value >= 0 || "Total Funds Required must be non-negative",
            })}
            className="input input-bordered"
            placeholder="Enter total funds required"
          />
          {errors.totalFundsRequired && (
            <span className="text-red-500 text-sm">
              {errors.totalFundsRequired.message}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Category</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="select select-bordered"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Sustainable Agriculture">
              Sustainable Agriculture
            </option>
            <option value="Water Conservation">Water Conservation</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Reforestation">Reforestation</option>
            <option value="Climate Action">Climate Action</option>
            <option value="Biodiversity Protection">
              Biodiversity Protection
            </option>
            <option value="Eco-friendly Products">Eco-friendly Products</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Start Date */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Start Date</span>
          </label>
          <input
            type="date"
            {...register("startDate", { required: "Start Date is required" })}
            className="input input-bordered"
          />
          {errors.startDate && (
            <span className="text-red-500 text-sm">
              {errors.startDate.message}
            </span>
          )}
        </div>

        {/* End Date */}
        <div className="form-control">
          <label className="label">
            <span className="p2">End Date</span>
          </label>
          <input
            type="date"
            {...register("endDate", { required: "End Date is required" })}
            className="input input-bordered"
          />
          {errors.endDate && (
            <span className="text-red-500 text-sm">
              {errors.endDate.message}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Location</span>
          </label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input input-bordered"
            placeholder="Enter location"
          />
          {errors.location && (
            <span className="text-red-500 text-sm">
              {errors.location.message}
            </span>
          )}
        </div>
        {/* Minimum Donation */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Minimum Donation (ETH)</span>
          </label>
          <input
            step="any"
            type="number"
            {...register("minDonation", {
              required: "Minimum Donation is required",
              valueAsNumber: true,
              validate: (value) =>
                value >= 0 || "Minimum Donation Required must be non-negative",
            })}
            className="input input-bordered"
            placeholder="Enter minimum donation"
          />
          {errors.minDonation && (
            <span className="text-red-500 text-sm">
              {errors.minDonation.message}
            </span>
          )}
        </div>

        {/* Maximum Donation */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Maximum Donation (ETH)</span>
          </label>
          <input
            step="any"
            type="number"
            {...register("maxDonation", {
              required: "Maximum Donation is required",
              valueAsNumber: true,
              validate: (value) =>
                value >= 0 || "Maximum Donation Required must be non-negative",
            })}
            className="input input-bordered"
            placeholder="Enter maximum donation"
          />
          {errors.maxDonation && (
            <span className="text-red-500 text-sm">
              {errors.maxDonation.message}
            </span>
          )}
        </div>

        {/* Media Upload */}
        <div className="form-control">
          <label className="label">
            <span className="p2">Media Upload</span>
          </label>
          {!mediaFile ? (
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered"
              accept="image/*"
            />
          ) : (
            <div className="relative w-32 h-32">
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={handleImageDelete}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-control justify-end items-end">
          <Button
            type="submit"
            cls="btn btn-primary"
            disabled={loading}
            text={loading ? "Creating..." : "Create Project"}
          />
        </div>
      </form>

      {alertMessage && (
        <div
          className={`alert ${
            alertType === "success" ? "alert-success" : "alert-error"
          } shadow-lg my-4`}
        >
          <div>
            <span>{alertMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProjectForm;
