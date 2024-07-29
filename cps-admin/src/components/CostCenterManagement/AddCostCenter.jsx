import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";
import $ from "jquery";
import * as Yup from "yup";
function AddCostCenter() {
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    dept: Yup.string().required("Department is required").max(40),
    role: Yup.string()
      .required("Cost Center is required")
      .min(3, "Minimum 3 Character")
      .max(50, "Cost Center must not exceed 50 characters"),
    centerCode: Yup.string()
      .required("Center code is required")
      .min(3, "Minimum 3 Character")
      .max(20, "Center code must not exceed 20 characters"),
  });

  const formik = useFormik({
    initialValues: {
      role: "",
      dept: "",
      centerCode: "",
      hidden_value: "Add",
    },

    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
                TimeOutPopUp(navigate);
                return;
              }
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "add-cost-center", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Created Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);

            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/cost-center-management")
                : navigate("/cost-center-management/Modify");
            }
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  const radioHandler = (status) => {
    setStatus(status);
  };

  // const GenerateCode = () => {
  //   var text = "";
  //   var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  //   var number = "123456789";

  //   for (var i = 0; i < 4; i++)
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   for (var j = 0; j < 1; j++)
  //     text += number.charAt(Math.floor(Math.random() * number.length));
  //   $("#promocode").val("CCCODE" + text);
  //   formik.values.centerCode = "CCCODE" + text;
  // };

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create Cost Center</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="custom-control col-md-12 ">
                  <label htmlFor="inputEmail4" className="form-label">
                    Choose Department
                  </label>
                  <div className="department">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dept"
                        value="sales"
                        id="flexRadioDefault1"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.dept === "sales"}
                        onClick={(e) => radioHandler(1)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Sales
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dept"
                        value="marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.dept === "marketing"}
                        onClick={(e) => radioHandler(2)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Marketing
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dept"
                        value="trade_market"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={
                          formik.values.dept === "trade_marketing"
                        }
                        onClick={(e) => radioHandler(2)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Trade Marketing
                      </label>
                    </div>
                  </div>
                  <div className="text-danger">
                    {formik.errors.dept && formik.touched.dept
                      ? formik.errors.dept
                      : null}
                  </div>
                </div>

                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Cost Center Name
                  </label>
                  <input
                    name="role"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                    autoComplete="false"
                    placeholder="Cost Center Name"
                    rre
                  />

                  <div className="text-danger">
                    {formik.errors.role && formik.touched.role
                      ? formik.errors.role
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Cost Center Code
                  </label>
                  <div className="captcha-generate-wrapper">
                    <input
                      name="centerCode"
                      type="text"
                      className="form-control"
                      id="promocode"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.centerCode}
                      autoComplete="false"
                      placeholder="Center Code"
                    />
                    {/* <i
                      className="fa fa-refresh"
                      aria-hidden="false"
                      onClick={GenerateCode}
                      title="generate code"
                    ></i> */}
                  </div>
                  <div className="text-danger">
                    {formik.errors.centerCode && formik.touched.centerCode
                      ? formik.errors.centerCode
                      : null}
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    {isLoading ? (
                      <>
                        <i className="fa fa-refresh fa-spin"></i>Loading
                      </>
                    ) : (
                      "Create"
                    )}
                  </button>

                  <Link
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/cost-center-management/Modify"
                        : "/cost-center-management"
                    }
                  >
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCostCenter;
