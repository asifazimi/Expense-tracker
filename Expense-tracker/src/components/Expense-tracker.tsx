import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
  description: string;
  amount: number;
  catagory: string;
}

export const Tracker = () => {
  const { register, handleSubmit, formState, reset, setValue } =
    useForm<FormData>();
  const [data, setData] = useState<FormData[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    if (editIndex !== null) {
      // Updaing the item
      const updateData = data.map((item, index) => {
        return index === editIndex ? formData : item;
      });
      setData(updateData);
      setEditIndex(null);
    } else {
      setData([...data, formData]);
    }
    reset();
  };

  const filteredData = filter
    ? data.filter((item) => item.catagory === filter)
    : data;

  // To add delete button for every item
  const deleteItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  // To edit item
  const editItem = (index: number) => {
    const item = data[index];
    console.log(item);
    setValue("description", item.description);
    setValue("amount", item.amount);
    setValue("catagory", item.catagory);
    setEditIndex(index);
  };

  return (
    <>
      {showPopup && (
        <div className="alert alert-success">Item deleted successfully!</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="description" className="mb-2">
          Description:
        </label>
        <input
          type="text"
          id="description"
          className="form-control mb-2"
          {...register("description", { required: "Description is required!" })}
        />
        {errors.description && (
          <p className="text-danger">{errors.description.message}</p>
        )}

        <label htmlFor="amount" className="mb-2">
          Amount:
        </label>
        <input
          type="number"
          id="amount"
          {...register("amount", {
            required: "Amount is required!",
            max: { value: 10, message: "Amount should be less than 10!" },
            valueAsNumber: true,
          })}
          name="amount"
          className="form-control mb-2"
        />
        {errors.amount && (
          <p className="text-danger">{errors.amount.message}</p>
        )}

        <label htmlFor="catagory" className="mb-2">
          Category:
        </label>
        <select
          {...register("catagory", { required: "Category is required!" })}
          name="catagory"
          id="catagory"
          className="form-control mb-2"
        >
          <option value="">Select a category</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Brod">Brod</option>
          <option value="Other">Other</option>
        </select>

        <button className="btn btn-primary mt-2" type="submit">
          {editIndex !== null ? "Update" : "Submit"}
        </button>
      </form>
      <h2 className="mt-4">Transaction History</h2>
      <label htmlFor="filter" className="mb-2"></label>

      <select
        id="filter"
        className="form-control"
        onChange={(e) => setFilter((e.target as HTMLSelectElement).value)}
        value={filter}
      >
        <option value="">All</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Brod">Brod</option>
        <option value="Other">Other</option>
      </select>
      {/* The items */}
      <table className="table mt-4 table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>${item.amount.toFixed(2)}</td>
                <td>{item.catagory}</td>
                {/* Add delete button */}
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteItem(index)}
                  >
                    delete
                  </button>
                </td>
                {/* Add edit button */}
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => editItem(index)}
                  >
                    edit
                  </button>
                </td>
              </tr>
            ))}
          </>
        </tbody>
      </table>
    </>
  );
};
