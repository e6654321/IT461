import { useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';

const DOG_URL = '/dogs';

const DogDelete = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dogs";
    const dog = location.state?.dog;

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');

    const handleYes = async () => {
        try {
          console.log(`${DOG_URL}/${dog.id}`)
            const response = await axios.delete(`${DOG_URL}/${dog.id}`,
            {
              params: {
                token: auth.accessToken,
              }
            });
            console.log(typeof(response), response);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 403) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Error');
            }
            errRef.current.focus();
        }
        navigate(from, { replace: true });
    }

    const handleNo = () => {
      navigate(from, { replace: true });
    }

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Delete {dog.name}?</h1>
            <div>
              <button onClick={handleYes}>Yes</button>
              <button onClick={handleNo}>No</button>
            </div>
        </section>

    )
}

export default DogDelete
