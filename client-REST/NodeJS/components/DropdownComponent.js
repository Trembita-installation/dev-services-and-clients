import { Form } from 'react-bootstrap';

const DropdownComponent = ({ label, value, onChange, options }) => {
  return (
    <Form style={{ marginBottom: 20 }}>
      <Form.Group controlId='formPerPage' className='row align-items-center'>
        <div className='col-sm-1'>
          <Form.Select
            className='w-auto'
            value={value}
            onChange={onChange}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </div>
        <Form.Label className='col-sm-11'>
          {label}
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default DropdownComponent;
