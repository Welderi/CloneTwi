import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPost from "./components/addPost/addPost";
import Main from "./components/main/main";
import Login from "./components/login/login";
import Register from "./components/register/register";
import ChangePassword from "./components/changePassword/changePassword";
import UserProfile from "./components/userProfile/userProfile";
import AdditionalUserSettings from "./components/additionalUserSettings/additionalUserSettings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/additionalUserSettings" element={<AdditionalUserSettings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
