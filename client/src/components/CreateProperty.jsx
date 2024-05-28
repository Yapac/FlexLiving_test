import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useStore, { getProperties } from "../store/store";
import axios from "axios";
import toast from "react-hot-toast";

const CreateProperty = () => {
  /**
   * 0. This is adding new properties file, it objective is
   *    To add a property to the store and updating the
   *    also json file in the backend
   */

  /* 1. Getting the store functions and values */
  const addProperty = useStore((state) => state.addProperty);
  const properties = useStore(getProperties);

  /* 2. Form state */
  const [newProperty, setNewProperty] = useState({
    _id: "",
    address: "",
    rentalCost: {
      "April:2024": "1300.000",
    },
    propertyName: "",
    tag: "Test added",
    contractStartDate: "2024-02-10",
    contractEndDate: "2025-02-09",
    directCost: {
      "April:2024": "1405.000",
    },
    group: "Full Property List",
    city: "",
    fixedCost: 0,
  });

  /* 3. Handling the submit */
  const onSubmit = (e) => {
    e.preventDefault();

    // 3.a. Checking if the form is well filled
    if (
      newProperty.propertyName == "" ||
      newProperty.fixedCost == 0 ||
      newProperty.city == "" ||
      newProperty.address == ""
    ) {
      // Error toast
      toast.error("Fill all the inputs!");
      return;
    }

    // 3.b. Adding a unique id the new property and adding it to the state
    const propertyWithId = { ...newProperty, _id: uuidv4() };
    addProperty(propertyWithId);

    // 3.c. Sending the new property data in the POST request
    axios
      .post("http://localhost:5000/api/properties", {
        properties: [propertyWithId, ...properties],
      })
      .then(() => {
        // Success toast
        toast.success("The new property is added!");
      })
      .catch((error) => {
        console.error("Error adding property:", error);
      });

    // 3.d. Clear the form
    setNewProperty({
      // Reset form values
      _id: "",
      address: "",
      rentalCost: {
        "April:2024": "1300.000",
      },
      propertyName: "",
      tag: "Test added",
      contractStartDate: "2024-02-10",
      contractEndDate: "2025-02-09",
      directCost: {
        "April:2024": "1405.000",
      },
      group: "Full Property List",
      city: "",
      fixedCost: 0,
    });
  };
  /* 4. The components JSX */
  return (
    <form className="mt-20 mb-8 ">
      <h2 className="pb-4 font-bold text-gray-800">Add a new property</h2>
      <input
        type="text"
        placeholder="Property name"
        value={newProperty.propertyName}
        onChange={(e) =>
          setNewProperty({ ...newProperty, propertyName: e.target.value })
        }
        className="border-b border-gray-500 bg-slate-100 focus:outline-none focus:border-blue-500 w-64 p-1 mr-4"
      />
      <input
        type="text"
        placeholder="City"
        value={newProperty.city}
        onChange={(e) =>
          setNewProperty({ ...newProperty, city: e.target.value })
        }
        className="border-b border-gray-500 bg-slate-100 focus:outline-none focus:border-blue-500 w-44 p-1 mr-4"
      />
      <input
        type="number"
        placeholder="Cost"
        value={newProperty.fixedCost}
        min={1}
        onChange={(e) =>
          setNewProperty({ ...newProperty, fixedCost: e.target.value })
        }
        className="border-b border-gray-500 bg-slate-100 focus:outline-none focus:border-blue-500 w-44 p-1 mr-4"
      />
      <input
        type="text"
        placeholder="Adress"
        value={newProperty.address}
        onChange={(e) =>
          setNewProperty({ ...newProperty, address: e.target.value })
        }
        className="border-b border-gray-500 bg-slate-100 focus:outline-none focus:border-blue-500 w- p-1 mr-4 w-96"
      />
      <button
        className="bg-gray-800 rounded-md px-5 h-9 text-white "
        onClick={onSubmit}
      >
        Add property
      </button>
      <hr className="mt-16" />
    </form>
  );
};

export default CreateProperty;
