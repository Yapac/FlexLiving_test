import { useEffect } from "react";
import CreateProperty from "./components/CreateProperty";
import PropertiesList from "./components/PropertiesList";

import { Toaster } from "react-hot-toast";
import useStore, { getError } from "./store/store";

import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  /**
   * 0. This is main file, it objective is to fetching the
   *    data in the main load and putting it in the store
   *    so all the other components can get the data from
   */

  /* 1. Getting the store functions */
  const setProperties = useStore((state) => state.setProperties);
  const setError = useStore((state) => state.setError);
  const error = useStore(getError);

  /* 2. Use effect runs once in the intial load to load the data and stores it */
  useEffect(() => {
    axios
      // 2.a. We initialize the fetch
      .get("http://localhost:5000/api/properties")
      // 2.b. If we got the data we stores it
      .then((response) => {
        setProperties(response.data.properties);
        setError(null);
      })
      // 2.c. If there is an error we set
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  /* 3. The components JSX */
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className="bg-slate-100 w-screen flex flex-col items-center pt-3 gap-16">
        {error ? (
          <div style={{ color: "red" }}>
            <p>Error fetching data: {error}</p>
          </div>
        ) : (
          <div className="container">
            <CreateProperty />
            <PropertiesList />
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
