import {Route, Routes} from "react-router-dom";
import AddPost from "./components/addPost/addPost";
import Main from "./components/main/main";
import './App.css';

function App() {
  return (
      <Route>
          <div>
              <Routes>
                  <Route to={"/addPost"} element={<AddPost/>}/>
                  <Route to={"/"} element={<Main/>}/>
              </Routes>
          </div>
      </Route>
  );
}

export default App;
