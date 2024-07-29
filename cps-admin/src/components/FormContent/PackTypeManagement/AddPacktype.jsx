import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import Select from "react-select";
import {TimeOutPopUp} from "../../TimeOut";


import * as Yup from "yup";
function AddPacktype() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [lineExt, setLineExt] = useState([]);
  const [sizes, setSizeList] = useState([]);
  const data = [];
  const options = [];
  const sizeList = [];
  useEffect(() => {
    getLevels();
  }, []);

  const getLevels = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-brands-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setLevels(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (levels) {
    levels.forEach((element) => {
      data.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const getLineExtension = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "brand-based-line-extension/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setLineExt(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (lineExt) {
    lineExt.forEach((element) => {
      options.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const getSizeList = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "line-based-size-list/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setSizeList(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };
  if (sizes) {
    sizes.forEach((element) => {
      sizeList.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("SKU name is required")
      .min(3, "Minimum 3 Character")
      .max(30, "SKU must not exceed 30 characters"),
    brandID: Yup.string().required("Brand is required"),
    lineExtID: Yup.string().required("Line Extension is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      brandID: "",
      sizeID: "",
      lineExtID: "",
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
        .post(process.env.REACT_APP_API_KEY + "add-packtype", data, {
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
                ? navigate("/packtype-management")
                : navigate("/packtype-management/Modify");
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

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create Pack Type</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Brand
                  </label>

                  <Select
                    name="brandID"
                    onChange={(selected) => {
                      formik.setFieldValue("brandID", selected.value);
                      getLineExtension(selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isOptionDisabled={(option) => option.isdisabled}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.brandID && formik.touched.brandID
                      ? formik.errors.brandID
                      : null}
                  </div>
                </div>

                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Line Extension
                  </label>

                  <Select
                    name="lineExtID"
                    onChange={(selected) => {
                      formik.setFieldValue("lineExtID", selected.value);
                      getSizeList(selected.value);
                    }}
                    options={options}
                    isSearchable={true}
                    isOptionDisabled={(option) => option.isdisabled}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.lineExtID && formik.touched.lineExtID
                      ? formik.errors.lineExtID
                      : null}
                  </div>
                </div>

                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Pack Size
                  </label>

                  <Select
                    name="sizeID"
                    onChange={(selected) => {
                      formik.setFieldValue("sizeID", selected.value);
                    }}
                    options={sizeList}
                    isSearchable={true}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.sizeID && formik.touched.sizeID
                      ? formik.errors.sizeID
                      : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Pack Type Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                    placeholder="Enter SKU Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.name && formik.touched.name
                      ? formik.errors.name
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
                        ? "/packtype-management/Modify"
                        : "/packtype-management"
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
export default AddPacktype;