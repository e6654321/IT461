import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function CatEdit({ getCats }) {
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const cat = location.state.cat;
  const [name, setName] = useState(cat.name);
  const navigate = useNavigate();
  const formHandler = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Name is required!');
      return;
    }

    cat.name = name;
    console.log('CAT: ', cat);
    const response = await axiosPrivate.put('/cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats('/cats/?limit=3&offset=0');
    navigate('/cats');
  };
  return (
    <form onSubmit={formHandler}>
      <div>
        <label>ID: {cat.id}</label>
      </div>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button>Update</button>
    </form>
  );
}
