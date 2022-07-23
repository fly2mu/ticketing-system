import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner } from "@themesberg/react-bootstrap";
import { toast } from "react-toastify";

import { addRequest, getCategories } from "../../api/requestApi";
import { Routes } from "../../routes";
import { useHistory } from "react-router-dom";
export default () => {
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const [request, setRequest] = useState({
    userRequest: localStorage.getItem("username"),
    department: "",
    email: localStorage.getItem("email"),
    category: "",
    // priority: "",
    titleRequest: "",
    subjekRequest: "",
    image: "",
    file_document: "",
  });
  const [categories, setCategory] = useState([]);
  let formData = new FormData();

  useEffect(() => {
    (async () => {
      const getCategoriesData = await getCategories();
      setCategory(getCategoriesData.data.data);
    })();
  }, []);

  const filterCategory = (e) => {
    if (e.target.value === "I") {
      setCategory(categories.filter((c) => c.id_type === "I"));
    } else if (e.target.value === "P") {
      setCategory(categories.filter((c) => c.id_type === "P"));
    } else {
      setCategory(categories);
    }
    console.log(categories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    formData.append("userRequest", request.userRequest);
    formData.append("department", request.department);
    formData.append("email", request.email);
    formData.append("type", request.type);
    formData.append("category", request.category);
    formData.append("titleRequest", request.titleRequest);
    formData.append("subjekRequest", request.subjekRequest);
    formData.append("image", request.image);
    formData.append("file_document", request.file_document);

    const sentRequest = await addRequest(formData);

    if (sentRequest.error) {
      toast.error("Oops! Something went wrong! Please try again later.");
    }

    toast.success("Request has been sent!");

    setRequest({
      userRequest: localStorage.getItem("username"),
      department: "",
      email: "",
      type: "",
      category: "",
      // priority: "",
      titleRequest: "",
      subjekRequest: "",
    });
    setIsPending(false);
    history.push(Routes.ListUserRequests.path);
    window.open(
      `/#/ticketing/render?user=${request.userRequest}&department=${request.department}&category=${request.category}&title=${request.titleRequest}&subjek=${request.subjekRequest}`,
      "_blank"
    );
    // window.open(
    //   `/#/ticketing/render?user=alwan&department=Finance&category=Install Software&title=request title&subjek=lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quaerat! Quasi, quisquam. Quasi, quisquam.`,
    //   "_blank"
    // );
  };

  return (
    <div className="mt-3">
      <Card border="light" className="shadow-sm p-3" style={{ width: "70%" }}>
        <h4>Add Requests</h4>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="user">
            <Form.Label>User request</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Masukkan username"
              value={localStorage.getItem("username")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              required
              onChange={(e) =>
                setRequest({ ...request, department: e.target.value })
              }
            >
              <option defaultValue>Open this select menu</option>
              <option value="Finance">Finance</option>
              <option value="GA">GA</option>
              <option value="Marketing">Marketing</option>
              <option value="Agent">Agent</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Masukkan email"
              value={localStorage.getItem("email")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select required onChange={(e) => filterCategory(e)}>
              <option defaultValue>Open this select menu</option>
              <option value="I">Incident</option>
              <option value="P">Request</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              required
              onChange={(e) =>
                setRequest({ ...request, category: e.target.value })
              }
            >
              <option defaultValue>Open this select menu</option>
              {categories.map((ctg) => {
                return (
                  <>
                    <option value={ctg.category}>{ctg.category}</option>
                  </>
                );
              })}
            </Form.Select>
          </Form.Group>

          {/* PRIORITY */}
          {/* <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              onChange={(e) =>
                setRequest({ ...request, priority: e.target.value })
              }
            >
              <option defaultValue>Open this select menu</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group> */}

          <Form.Group controlId="titleRequest" className="mb-3">
            <Form.Label>Title request</Form.Label>
            <Form.Control
              type="text"
              id="titleRequest"
              required
              placeholder="Masukkan title request"
              onChange={(e) =>
                setRequest({ ...request, titleRequest: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="subjekRequest" className="mb-3">
            <Form.Label>Subjek request</Form.Label>
            <Form.Control
              as="textarea"
              rows="5"
              id="subjekRequest"
              required
              placeholder="Masukan subjek request"
              onChange={(e) =>
                setRequest({ ...request, subjekRequest: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              id="image"
              placeholder="Upload image"
              onChange={(e) =>
                setRequest({ ...request, image: e.target.files[0] })
              }
            />
          </Form.Group>

          <Form.Group controlId="file_document" className="mb-3">
            <Form.Label>File document</Form.Label>
            <Form.Control
              type="file"
              id="file_document"
              placeholder="Upload file document"
              onChange={(e) =>
                setRequest({ ...request, file_document: e.target.files[0] })
              }
            />
          </Form.Group>

          {isPending ? (
            <Button variant="primary" type="submit" disabled>
              <Spinner animation="border" size="sm" role="status" /> Sending...
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </Form>
      </Card>
    </div>
  );
};
