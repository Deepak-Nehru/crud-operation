import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, InputGroup, FloatingLabel, Button, Table, Container, Row, Col } from 'react-bootstrap';

const SaveContact = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/items');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    try {
      const url = isEditing ? `http://localhost:3000/items/${editItemId}` : 'http://localhost:3000/items';
      await axios[isEditing ? 'put' : 'post'](url, formData);
      fetchData();
      setFormData({});
      setIsEditing(false);
      setEditItemId(null);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} item:`, error);
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    setFormData({ name: itemToEdit.name, phoneNumber: itemToEdit.phoneNumber });
    setIsEditing(true);
    setEditItemId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/items/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdate();
  };

  return (
    <Container className="form-container">
    <Row className="justify-content-center">
      <Col md={6}>
        <Form onSubmit={handleSubmit}>
          <div className="text-center my-2 py-3">
            <h2 className="text-secondary">Save Contacts</h2>
          </div>
        <Form className="mb-5">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <i className="bi bi-person"></i>
            </InputGroup.Text>
            <FloatingLabel controlId="floatingName" label="Name">
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon2">
              <i className="bi bi-telephone"></i>
            </InputGroup.Text>
            <FloatingLabel controlId="floatingPhoneNumber" label="Phone Number">
              <Form.Control
                type="tel"
                pattern="[0-9]+"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </InputGroup>
          <div className="text-center">
            <Button
              type="button"
              className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'}`}
              onClick={handleAddOrUpdate}
            >
              {isEditing ? 'Update Contact' : 'Add Contact'}
            </Button>
          </div>
        </Form>
      </Form>

      <Table striped bordered hover responsive className="table-light">
        <thead striped bordered hover responsive className='table-dark'>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.phoneNumber}</td>
              <td>
                <Button
                  type="button"
                  className="btn btn-warning btn-sm d-flex align-items-center"
                  onClick={() => handleEdit(item.id)}
                >
                  <i className="bi bi-pencil-square"></i>
                  <span className="ms-2">Edit</span>
                </Button>
              </td>
              <td>
                <Button
                  type="button"
                  className="btn btn-danger btn-sm d-flex align-items-center"
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="bi bi-trash"></i> <span className="ms-2">Delete</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default SaveContact;
