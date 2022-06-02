import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function CatAdd({ getCats }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const formHandler = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Name is required!');
      return;
    }

    console.log('CAT: ', name);
    const response = await axiosPrivate.post(
      '/cats/',
      JSON.stringify({ id: 0, name })
    );
    console.log(response.data);
    getCats('/cats/?limit=3&offset=0');
    navigate('/cats');
  };
  return (
    <form onSubmit={formHandler}>
      <label>Name</label>
      <input
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button>Add</button>
    </form>
  );
}
