import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast for notifications

const URL = "http://localhost:8080/api/v1/user/register";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match"); // Show error toast
      return;
    }

    try {
      // Send the correct data to the backend
      const response = await axios.post(URL, {
        fullName: formData.fullName,
        username: formData.username, // Ensure 'username' is passed, not email
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender,
      });

      if (response.data.success) {
        toast.success(response.data.message); // Show success toast
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error during registration"); // Show error toast
      console.error(
        "Error during registration:",
        error.response?.data || error
      );
    }

    setFormData({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              className="w-full input input-bordered h-10 bg-white"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              className="w-full input input-bordered h-10 bg-white"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              className="w-full input input-bordered h-10 bg-white"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              className="w-full input input-bordered h-10 bg-white"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* Gender Selection */}
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="radio mx-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="radio mx-2"
                />
                Female
              </label>
            </div>
          </div>

          <p className="text-center my-2">
            Already have an account? <Link to="/login"> Login </Link>
          </p>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 border border-slate-700 bg-white"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
