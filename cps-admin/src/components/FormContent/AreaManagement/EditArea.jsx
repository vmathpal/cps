import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../../TimeOut";
import Select from "react-select";
import * as Yup from "yup";
import LoadingSpinner from "../../Loader/LoadingSpinner";
function EditArea() {
  const {
    state: { id },
  } = {state:useParams()};
  const data = [];
  const [inputs, setInputs] = useState({});
  const [isLoadData, setIsLoadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBrand();
    getLevels();
  }, []);
  const getLevels = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-area-list", {
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
  const fetchBrand = () => {
    axios
      .get(process.env.REACT_APP_API_KEY + "singleArea/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(">>>>data", res.data.data);
        setInputs({
          name: res.data.data.name,
          value: res.data.data.Channel.id,
          label: res.data.data.Channel.name,
        });
        res.data ? setIsLoadData(true) : setIsLoadData(false);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("District name is required")
      .min(3, "Minimum 3 Character")
      .max(30, "PackType name must not exceed 30 characters"),
    channelID: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: inputs.name,
      channelID: inputs.value,
      hidden_value: inputs.name,
    },

    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
        TimeOutPopUp(navigate);
        return;
      }
     
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "update-area/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);

            <Link
              className="btn btn-primary mx-3"
              to={
                localStorage.getItem("user_role") === "sub_admin"
                  ? "/area-management/Modify"
                  : "/area-management"
              }
            >
              Back
            </Link>;
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
  if (!isLoadData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Edit District</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Region
                  </label>

                  <Select
                    defaultValue={{
                      label: inputs.label,
                      value: inputs.value,
                    }}
                    name="channelID"
                    onChange={(selected) => {
                      formik.setFieldValue("channelID", selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isDisabled={true}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.channelID && formik.touched.channelID
                      ? formik.errors.channelID
                      : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    District Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={inputs.name}
                    autoComplete="false"
                    placeholder="Enter District Name"
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
                      "Update"
                    )}
                  </button>

                  <Link
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/area-management/Modify"
                        : "/area-management"
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

export default EditArea;