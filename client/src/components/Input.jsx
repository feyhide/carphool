/* eslint-disable react/prop-types */
const Input = ({ name, type, placeholder, onChange, value }) => {
  return (
    <>
      <label className="text-base sm:text-lg md:text-xl">{placeholder}</label>
      <input
        onChange={onChange}
        value={value}
        autoComplete="off"
        name={name}
        className="p-2 text-base sm:text-lg md:text-xl text-gray-500 outline-none bg-transparent border-b-2 border-gray-400 hover:border-black transition-all ease"
        type={type}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
