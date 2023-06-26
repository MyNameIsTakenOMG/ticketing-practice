import { useState } from 'react';
import axios from 'axios';
import useRequest from '../../hooks/useRequest';

export default function signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [errors, setErrors] = useState([]);
  const { doRequest, errors } = useRequest({
    url: 'http://34.31.61.77/api/users/signup',
    method: 'POST',
    body: { email, password },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    // try {
    //   const response = await axios.post(
    //     '/api/users/signup',
    //     { email, password },
    //     {
    //       // baseURL: 'https://ticketing.dev',
    //       baseURL: 'http://34.31.61.77', // make sure to send https, or cookie will not be set
    //     }
    //   );
    //   console.log(response.data);
    // } catch (error) {
    //   setErrors(error.response.data.errors);
    // }
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>sign up</div>
      <div className="form-group">
        <label>email address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      {/* {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )} */}
      <button className="btn btn-primary">sign up</button>
    </form>
  );
}
