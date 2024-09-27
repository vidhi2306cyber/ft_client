import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { CustomInput } from "./CustomInput";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loginUser, postNewUser } from "../../helpers/axiosHelper";
import useForm from "../hooks/useForm";
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
const initialState = {
  email: "",
  password: "",
};
export const SignInForm = () => {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { form, handleOnChange } = useForm(initialState);

  const goTo = location?.state?.from?.pathname || "/dashboard";
  useEffect(() => {
    user?._id && navigate(goTo);
  }, [user?._id, navigate, goTo]);

  const fields = [
    {
      label: "Email",
      placeholder: "John@email.com",
      required: true,
      type: "email",
      name: "email",
    },
    {
      label: "Password",
      placeholder: "******",
      required: true,
      type: "password",
      name: "password",
    },
  ];

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    console.log(form);

    const pendingResp = loginUser(form);
    toast.promise(pendingResp, {
      pending: "Please wait .....",
    });

    const { status, message, user, accessJWT } = await pendingResp;

    toast[status](message);
    console.log(user, accessJWT);
    setUser(user);
    accessJWT && localStorage.setItem("accessJWT", accessJWT);
  };

  return (
    <div className="border rounded p-4">
      <h4 className="mb-5">Sign In now!</h4>
      <hr />
      <Form onSubmit={handleOnSubmit}>
        {fields.map((input) => (
          <CustomInput key={input.name} {...input} onChange={handleOnChange} />
        ))}

        <div className="d-grid">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
