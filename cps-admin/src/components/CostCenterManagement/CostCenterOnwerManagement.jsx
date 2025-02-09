import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import {TimeOutPopUp} from "../TimeOut";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";
export default function CostCenterOnwerManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  let { action } = useParams();
  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "cost_center_users",
            className: "btn btn-info mt-2",
            exportOptions: {
              columns: ":not(.no-export)", // Exclude columns with the "no-export" class
            },
          },
        ],
        bDestroy: true,
        fixedHeader: true,
        pagingType: "full_numbers",
        pageLength: 10,
        processing: true,
        dom: "Bfrtip",
        select: true,
      });
    }, 500);
  };
  useEffect(() => {
    if (! localStorage.getItem("token")) {
     TimeOutPopUp(navigate);
      return;
      }
    //$('.dt-buttons').hide();
    getCostCenterUsers();
    document.body.className = "pace-done no-loader users";
    if ($("body").hasClass("users")) {
      $(".dt-buttons").addClass("csv-button");
    }
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);
  const getCostCenterUsers = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "cost-center-user",
      method: "get",
      params: {
        url: "cost-owner-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log(">>>data cost Center", response.data.data);
        setRoles(response.data.data);
        setIsLoading(false);
        initializeDataTable();
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        if (error.response.status === 423) {
          swal({
            title: "Error!",
            text: "Permission Denied",
            icon: "error",
            button: "Okay",
          });
          navigate("/dashboard");
          return false;
        }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const deleteRole = async (id) => {
    confirmAlert({
      title: "Confirm to Delete?",
      message: "Are you sure want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(
                process.env.REACT_APP_API_KEY + "delete-cost-center-user/" + id,
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Deleted!",
                  text: "Deleted Successfully",
                  icon: "success",
                  button: "Okay",
                });
                initializeDataTable();
                getCostCenterUsers();
              })
              .catch(function (error) {
                if (error.response.status === 422) {
                  swal(
                    "Oops",
                    "The role has already assigned to a user, you are not allowed to delete",
                    "error"
                  );
                }
                setIsLoading(false);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const handleChange = async (id) => {
    await axios
      .get(
        process.env.REACT_APP_API_KEY + "cost-user-status/" + id,

        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {
        if (response.status === 200) {
          swal({
            title: "Success!",
            text: "Update SuccessFully!",
            icon: "success",
            button: "Okay",
          });
        }
        initializeDataTable();
        getCostCenterUsers();
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.data.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
      });
  };

  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">UserID</th>
          <th scope="col">Cost Center Role</th>
          <th scope="col">Code</th>
          <th scope="col">Email</th>
          <th scope="col">Department</th>
          <th scope="col">Status</th>
          {localStorage.getItem("user_role") === "super_admin" ? (
            <th scope="col" className="no-export">
              Action
            </th>
          ) : localStorage.getItem("user_role") === "sub_admin" &&
            action === "Modify" ? (
            <th scope="col" className="no-export">
              Action
            </th>
          ) : (
            ""
          )}
        </tr>
      </thead>
      <tbody>
        {roles.map((role, index) => (
          <React.Fragment key={role.id}>
            <tr>
              <td>{++index}</td>
              <td>{role.User.name}</td>
              <td>{role.CostCenter.name}</td>
              <td>{role.CostCenter.centerCode}</td>
              <td>{role.User.email}</td>
              <td>
                {role?.department === "sales"
                  ? "Sales"
                  : role?.department === "trade_marketing"
                  ? "Trade Marketing"
                  : role?.department === "marketing"
                  ? "Marketing"
                  : "Other"}
              </td>

              <td>{role.status === "active" ? "Active" : "Inactive"}</td>
              <td>
                <NavLink
                  to={{
                    pathname: "/cost-owner-management/edit-cost-owner/"+role.id,
                  }}
                  state={{ id: role.id }}
                >
                  <span className="material-icons" title="EDIT">
                    edit
                  </span>
                </NavLink>
                &nbsp;
                {/* <span
                  style={{ color: "red", cursor: "pointer" }}
                  className="material-icons-outlined cursor-default"
                  onClick={() => {
                    deleteRole(role.id);
                  }}
                  title="Delete"
                >
                  delete
                </span> */}
                <span
                  style={
                    role.status === "active"
                      ? { color: "green", cursor: "pointer" }
                      : { color: "red", cursor: "pointer" }
                  }
                  className="material-icons-outlined"
                  onClick={() => {
                    handleChange(role.id);
                  }}
                  title={role.status === "active" ? "Active" : "Inactive"}
                >
                  {role.status === "active" ? "toggle_on" : "toggle_off"}
                </span>
                &nbsp;
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Cost Center User Management</h1>
          </div>
        </div>
      </div>
      <>
        {localStorage.getItem("user_role") === "super_admin" ? (
          <NavLink
            className="btn btn-info"
            to="/cost-owner-management/add-cost-owner"
          >
            Create Cost Center Owner
          </NavLink>
        ) : localStorage.getItem("user_role") === "sub_admin" &&
          action === "Modify" ? (
          <NavLink
            className="btn btn-info"
            to={{ pathname: "/cost-owner-management/add-cost-owner" }}
            state={{ action: action }}
          >
            Create Cost Center Owner
          </NavLink>
        ) : (
          ""
        )}
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
