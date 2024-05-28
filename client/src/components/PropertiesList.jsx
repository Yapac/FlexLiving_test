import { useEffect, useState } from "react";
import useStore, { getProperties } from "../store/store";

import { useDrag, useDrop } from "react-dnd";

/* A. Main Element */
const PropertiesList = () => {
  /**
   * 0. This file handles the properties listing, draging
   *    and filtering
   */

  /* 1.a. Getting the store functions */
  const properties = useStore(getProperties);
  const updateSingleProperty = useStore((state) => state.updateSingleProperty);

  /* 1.b. Setting up the state for each Group */
  const [requiredProperties, setRequiredProperties] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [readyProperties, setReadyProperties] = useState([]);

  /* 1.c. Setting up the tate for the filter input */
  const [filterTerm, setFilterTerm] = useState("");

  /* 2. The Droping Mechnism: using the useDrop hook from react-dnd
    to set up the dropping mechanism*/
  const [{ isOverRequired }, dropRequired] = useDrop(() => ({
    accept: "property",
    drop: (item) => droppingHandling(item.id, "Exited"),
    collect: (monitor) => ({
      isOverRequired: !!monitor.isOver(),
    }),
  }));
  const [{ isOverPending }, dropPending] = useDrop(() => ({
    accept: "property",
    drop: (item) => droppingHandling(item.id, "On Cleaning Proccess"),
    collect: (monitor) => ({
      isOverPending: !!monitor.isOver(),
    }),
  }));
  const [{ isOverReady }, dropReady] = useDrop(() => ({
    accept: "property",
    drop: (item) => droppingHandling(item.id, "Full Property List"),
    collect: (monitor) => ({
      isOverReady: !!monitor.isOver(),
    }),
  }));

  /* 3. Updating the property in drag/drop function */
  const droppingHandling = (id, zone) => {
    updateSingleProperty(id, zone);
  };

  /* 4. Setting up each property in the correct group */
  useEffect(() => {
    setRequiredProperties(
      properties.filter(
        (property) =>
          property.group === "Exited" &&
          property.propertyName.toLowerCase().includes(filterTerm.toLowerCase())
      )
    );
    setPendingProperties(
      properties.filter(
        (property) =>
          property.group === "On Cleaning Proccess" &&
          property.propertyName.toLowerCase().includes(filterTerm.toLowerCase())
      )
    );
    setReadyProperties(
      properties.filter(
        (property) =>
          property.group === "Full Property List" &&
          property.propertyName.toLowerCase().includes(filterTerm.toLowerCase())
      )
    );
  }, [properties, filterTerm]);

  /* 3. The components JSX */
  return (
    <>
      {/* Input field for filtering */}
      <div className="mb-14">
        <h2 className="pb-4 font-bold text-gray-800">
          Search for a specific property
        </h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="border-b border-gray-500 bg-slate-100 focus:outline-none focus:border-blue-500 p-1 mr-4 w-3/4"
        />
      </div>

      <section className="flex justify-around gap-8 mb-24">
        {properties ? (
          <>
            <div
              ref={dropRequired}
              className={`list ${isOverRequired ? "bg-white" : "bg-slate-50"} `}
            >
              <h2 className="font-bold text-gray-800">Cleanings Required</h2>
              <section>
                {requiredProperties.map((item) => (
                  <Property
                    id={item._id}
                    key={item._id}
                    name={item.propertyName}
                    address={item.address}
                  />
                ))}
              </section>
            </div>
            <div
              ref={dropPending}
              className={`list ${isOverPending ? "bg-white" : "bg-slate-50"} `}
            >
              <h2>Cleanings Pending</h2>
              <section>
                {pendingProperties.map((item) => (
                  <Property
                    id={item._id}
                    key={item._id}
                    name={item.propertyName}
                    address={item.address}
                  />
                ))}
              </section>
            </div>
            <div
              ref={dropReady}
              className={`list ${isOverReady ? "bg-white" : "bg-slate-50"} `}
            >
              <h2>Cleanings Done</h2>
              <section>
                {readyProperties.map((item) => (
                  <Property
                    id={item._id}
                    key={item._id}
                    name={item.propertyName}
                    address={item.address}
                  />
                ))}
              </section>
            </div>
          </>
        ) : (
          <>Loading</>
        )}
      </section>
    </>
  );
};

/* A. Single Property Element */
const Property = ({ id, name, address }) => {
  /* 1. The Dragging Mechnism: using the useDrag hook from react-dnd
    to set up the dragging mechanism*/
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "property",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${
        isDragging ? "opacity-50" : "opacity-100"
      } bg-slate-100`}
    >
      <h3 className="font-medium pb-12 underline">{name}</h3>
      <small>{address}</small>
    </div>
  );
};

export default PropertiesList;
