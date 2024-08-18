"use client";
import MultiSelect from "@/components/form/MultiSelect";
import SelectGroup from "@/components/form/SelectGroup";
import Switcher from "@/components/form/Switcher";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export const RequestForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    if (isOnline == false) {
      fetch("/api/regions/provinces")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProvinces(() => data);
        })
        .catch((error) => {
          console.error("Error fetching provinces:", error);
        });
    }

    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        console.log({ tags: data });
        setTags(() => data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [isOnline === false]);

  const getDistrict = (provinceId: string) => {
    setLoading(true);
    fetch(`/api/regions/provinces/${provinceId}`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(() => data);
        setLoading(() => false);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        setLoading(false);
      });
  };

  const handleProvinceSelect = (provinceId: string) => {
    console.log(selectedProvince);
    setSelectedProvince(provinceId);
    getDistrict(provinceId);
  };

  const validate = (data: any) => {
    const errors: { [key: string]: string } = {};

    if (isOnline == false) {
      if (selectedProvince == "" || selectedDistrict == "") {
        errors.location =
          "Province and district are required for offline requests.";
      }
    }
    if (!data.title.value) {
      errors.title = "Title is required.";
    }
    if (!data.description.value) {
      errors.description = "Description is required.";
    }
    if (!data.dateTime.value) {
      errors.dateTime = "Date and time are required.";
    }
    if (selectedTags.length < 1) {
      errors.tags = "At least one tag is required.";
    }

    return errors;
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = event.target as any;

    const formData = {
      title: data.title.value,
      description: data.description.value,
      dateTime: data.dateTime.value,
      tags: selectedTags,
      reward: Number(data.reward.value) < 5000 ? null : data.reward.value,
      specialRequest: data.specialRequest.value,
      additionalRequest: data.additionalRequest.value,
      provinceId: selectedProvince,
      districtId: selectedDistrict,
      isOnline,
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    const response = await fetch("/api/request/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push("/request");
    } else {
      console.error("Failed to submit request");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Request Information Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Request Information
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Title <span className="text-meta-1">*</span>
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="Enter your request title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />

                {errors.title && (
                  <span className="my-1 text-red text-xs font-medium">
                    {errors.title}
                  </span>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  placeholder="Type your request description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
                {errors.title && (
                  <span className="my-1 text-red text-xs font-medium">
                    {errors.description}
                  </span>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Date <span className="text-meta-1">*</span>
                </label>
                <input
                  name="dateTime"
                  type="datetime-local"
                  placeholder="Enter your request title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors.title && (
                  <span className="my-1 text-red text-xs font-medium">
                    {errors.dateTime}
                  </span>
                )}
              </div>

              <div className="mb-4.5">
                <MultiSelect
                  id="multiSelect"
                  label="Tags"
                  dataOptions={tags}
                  onSelect={(value) => setSelectedTags(value)}
                />
                {errors.title && (
                  <span className="my-1 text-red text-xs font-medium">
                    {errors.tags}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* <!-- Additional Request Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Addional Information
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Reward (IDR)
                </label>
                <input
                  name="reward"
                  type="number"
                  min={5000}
                  placeholder="Enter your request title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Special request
                </label>
                <textarea
                  name="specialRequest"
                  rows={6}
                  placeholder="Type your special request"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Additional request
                </label>
                <textarea
                  name="additionalRequest"
                  rows={6}
                  placeholder="Type your additional request"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Sign Up Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Location
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-5.5">
                <div className="flex flex-row items-center gap-x-2">
                  <Switcher
                    onSwitch={(value) => {
                      if (value == true) {
                        setProvinces(() => []);
                        setDistricts(() => []);
                        setSelectedProvince(() => "");
                        setSelectedDistrict(() => "");
                      }
                      setIsOnline(value);
                    }}
                  />
                  I want <b>online</b> mentoring
                </div>
              </div>
              <div className="mb-5.5">
                <SelectGroup
                  label="Select Province"
                  options={provinces}
                  onSelect={handleProvinceSelect}
                  disabled={isOnline}
                />
                {errors.title && (
                  <span className="my-1 text-red text-xs font-medium">
                    {errors.location}
                  </span>
                )}
              </div>

              <div className="mb-5.5">
                {districts.length > 0 ? (
                  loading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      <SelectGroup
                        label="Select District"
                        options={districts}
                        onSelect={(value) => setSelectedDistrict(value)}
                        disabled={isOnline}
                      />
                      {errors.title && (
                        <span className="my-1 text-red text-xs font-medium">
                          {errors.location}
                        </span>
                      )}
                    </>
                  )
                ) : (
                  <div></div>
                )}
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
