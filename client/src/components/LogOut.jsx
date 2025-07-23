import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localStorage
        localStorage.removeItem("token");
       
        navigate("/");
    }, []);

    return null;
}
export default LogOut;