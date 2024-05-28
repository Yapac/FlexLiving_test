import { create } from "zustand";

const useStore = create((set) => ({
  // A. State values
  properties: [],
  error: null,

  // B. State functions
  setProperties: (data) => set((state) => ({ ...state, properties: data })),
  addProperty: (property) => {
    set((state) => ({ ...state, properties: [property, ...state.properties] }));
  },
  updateSingleProperty: (id, newGroup) => {
    set((state) => {
      // 1. Find the index of the property to update
      const propertyIndex = state.properties.findIndex(
        (property) => property._id === id
      );
      const updatedProperties = [...state.properties];

      // 2. Update the property
      const updatedProperty = {
        ...updatedProperties[propertyIndex],
        group: newGroup,
      };

      // 3.Remove the property from its original position and put it in first position for good UX
      updatedProperties.splice(propertyIndex, 1);
      updatedProperties.unshift(updatedProperty);

      // 4. Update the state
      return { ...state, properties: updatedProperties };
    });
  },
  setError: (newError) => set((state) => ({ ...state, error: newError })),
  clearError: () => set((state) => ({ ...state, error: null })),
}));

// C. State Getters
export const getProperties = (state) => state.properties;
export const getError = (state) => state.error;

export default useStore;
