import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import OtherUsers from "./OtherUsers";

const API_URL = "http://localhost:8080/api/v1/user/logout"; // ✅ Fixed extra space

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Logout Function with Better Error Handling
  const logoutHandler = async () => {
    try {
      const res = await axios.post(API_URL, { withCredentials: true });

      toast.success(res.data.message || "Logged out successfully!");

      // ✅ Clear Redux Store
      dispatch(setAuthUser(null));
      dispatch(setMessages([]));
      dispatch(setOtherUsers([]));
      dispatch(setSelectedUser(null));

      // ✅ Redirect to Login Page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  };

  // ✅ Search Function (Avoid modifying Redux store directly)
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Please enter a name to search.");
      return;
    }

    const filteredUsers = otherUsers.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredUsers.length > 0) {
      dispatch(setOtherUsers(filteredUsers)); // ✅ Update Redux state properly
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      {/* ✅ Search Bar */}
      <form onSubmit={searchSubmitHandler} className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-md"
          type="text"
          placeholder="Search..."
        />
        <button type="submit" className="btn bg-zinc-700 text-white">
          <BiSearchAlt2 className="w-6 h-6 outline-none" />
        </button>
      </form>

      <div className="divider px-3"></div>

      {/* ✅ Display Other Users */}
      <OtherUsers />

      {/* ✅ Logout Button */}
      <div className="mt-2">
        <button onClick={logoutHandler} className="btn btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
