import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPost from "./components/addPost/addPost";
import Main from "./components/main/main";
import Login from "./components/login/login";
import Register from "./components/register/register";
import ChangePassword from "./components/changePassword/changePassword";
import UserProfile from "./components/userProfile/userProfile";
import AdditionalUserSettings from "./components/additionalUserSettings/additionalUserSettings";
import FirstPage from "./components/firstPage/firstPage";
import Bookmarks from "./components/bookmarks/bookmarks";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FirstPage />} />
                <Route path="/main" element={<Main/>}/>
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/bookmarks" element={<Bookmarks/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="/userProfile/:userId?" element={<UserProfile />} />
                <Route path="/additionalUserSettings" element={<AdditionalUserSettings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
